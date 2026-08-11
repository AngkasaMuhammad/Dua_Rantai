
"use strict"

import {
	mat4 as m4,
	//vec4 as v4,
	vec3 as v3,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

import {
	lih,
} from './coba0func.js'


//= * = * = * = * = * = *
let pi = Math.PI

//+ - + - + - + - + - + -





//=========================
//
//		CAMERA SETUP 0
//
//=========================
export let _camsetup0 = class{
	static mode = '' //rotate, move, pan,
	static pointermoving = false
	
	static instarr = []
	static activecam = null
	static init = ()=>{
		let _c = _camsetup0
		//pake e=> agar this tidak berupa window
		addEventListener('pointermove',e=>{ if(!_c.pointermoving){return} switch(_c.mode){// horizon
			case 'rotate':_c.activecam.fcamrotxy(e); break
			case 'move':_c.activecam.fcammovexy(e); break
			case 'pan':_c.activecam.fcampanxy(e); break
		}},{ passive: false },)
		addEventListener('wheel',e=>{ switch(_c.mode){// depth
			case 'rotate':_c.activecam.fcamrotde(e); break
			case 'move':_c.activecam.fcammovede(e); break
			case 'pan':_c.activecam.fcampande(e); break
		}},)
		_c.init = 'single use'
	}
	
	constructor(camout,cammic,){
		
		this.pan = m4.identity()
		this.hor = m4.identity() //horizontal
		this.camrx = -.5
		this.zoom = m4.scaling(Array(3).fill(55))
		this.camout = camout
		this.mic = cammic
		_camsetup0.instarr.push(this)
	}
	
	
	
	fcamrotxy(e){
		this.camrx -= e.movementY/99
		this.camrx = Math.min(this.camrx,pi/2,)
		this.camrx = Math.max(this.camrx,-pi/2,)
		let camry = -e.movementX/99
		m4.rotateY(this.hor,camry,this.hor,)
	}
	fcamrotde(e){
		let s = Math.pow(1.001,e.deltaY,)
		m4.scale(this.zoom,[s,s,s,],this.zoom,)
	}
	fcammovexy(e){
		let x = e.movementX/222
		let z = e.movementY/222
		
		m4.mul(this.hor,this.zoom,this.hor,)
		m4.translate(this.hor,[x,0,z,],this.hor,)
		m4.invert(this.zoom,this.zoom,)
			m4.mul(this.hor,this.zoom,this.hor,)
		m4.invert(this.zoom,this.zoom,)
	}
	fcammovede(e){
		let y = e.deltaY/999
		
		m4.mul(this.hor,this.zoom,this.hor,)
		m4.translate(this.hor,[0,y,0,],this.hor,)
		m4.invert(this.zoom,this.zoom,)
			m4.mul(this.hor,this.zoom,this.hor,)
		m4.invert(this.zoom,this.zoom,)
	}
	fcampanxy(e){
		let x = e.movementX/222
		let y = -e.movementY/222
		
		m4.translate(this.pan,[x,y,0,],this.pan,)
	}
	fcampande(e){
		let s = Math.pow(1.001,e.deltaY,)
		m4.scale(this.pan,[s,s,s,],this.pan,)
	}
	
	fcamreset(){
		let _c = _camsetup0
		
		lih('reset '+_c.mode)
		switch (_c.mode){
			case 'rotate':
				m4.translation(m4.getTranslation(this.hor),this.hor,)
				m4.scaling(Array(3).fill(55),this.zoom,)
				this.camrx = -.5
			break
			case 'move':
				let m = this.hor
				;[m[12],m[13],m[14],] = [0,0,0,]
			break
			case 'pan':
				m4.identity(this.pan)
			break
		}
	}
	
	
	fcam(persp){//pos
		
		m4.copy(this.hor,this.camout,)
			m4.rotateX(this.camout,this.camrx,this.camout,)
			m4.mul(this.camout,this.zoom,this.camout,)
			m4.translate(this.camout,[0,0,1,],this.camout,)
			m4.invert(this.zoom,this.zoom,)
				m4.mul(this.camout,this.zoom,this.camout,) //kembali ke scale awal
			m4.invert(this.zoom,this.zoom,)
		m4.invert(this.camout,this.camout,)
		m4.copy(this.camout,this.mic,)
		
		
		//persp
		m4.mul(persp,this.camout,this.camout,)
		//pan
		m4.invert(this.pan,this.pan,)
			m4.mul(this.pan,this.camout,this.camout,)
		m4.invert(this.pan,this.pan,)
	}
}





//=========================
//
//		ANIMATION
//
//=========================
let _animation = class{ //GAKEPAKE
	constructor(){ //(parlay)
		let obj = this
		let ani = obj.ani = {}
	}
	
	
	
	
	animate(data,json,slot,t,){
		let info = json.info
		
		if(!(slot in info)){ //validation
			throw 'Slot '+slot+' not found'
		}
		
		
		let obj = this
		let ani = obj.ani
		
		for(let k in info[slot]){
			let [offset,size,] = info[slot][k]
			//cari frame
			let l = 0
			let m = 0
			let r = size
			for(let i = 0;i < size;i++){
				m = Math.floor((l+r)/2)
				if(l === m){break}
				let data_t = new Int32Array(
					data.buffer,
					((offset+m)*17+0)*4,
					1,
				)[0]
				;(data_t < t)
				?(l = m)
				:(r = m)
			}
			
			ani[k] = new Float32Array(
				data.buffer,
				((offset+l)*17+1)*4,
				16,
			)
		}
	}
}