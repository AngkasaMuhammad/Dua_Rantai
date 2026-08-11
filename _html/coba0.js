
"use strict"


//import {main} from 'https://angkasamuhammad.github.io/Poly-Landhep-5/js/PL5_1.js'
import {main} from 'http://127.0.0.1:8080/cobafolder/WebGPU/Poly-Landhep-5/js/PL5_1.js'

import {
	mat4 as m4,
	//vec4 as v4,
	vec3 as v3,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

import {
	_camsetup0,
} from './coba0class.js'

import {
	lih,
	matide,
	resize3dcanvas,
} from './coba0func.js'

import {
	setallobjinfo,
	persp,
} from './coba0art.js'



let floaded = null
export let loaded = new Promise((res,rej,)=>{
    floaded = res
})
export let render
export let audio
export let dt = 0
export let env_dt = 0
export let fstep = param_ss=>ss = param_ss
let ss = 7 //skip steps


;(async ()=>{


let canv3d = document.querySelector('#canv3d')
let PL5 = await main(
	canv3d,
	canv3d.getContext('webgpu'),
	document.getElementById('link_reso').href,
	document.getElementById('link_wasm').href,
)
render = PL5.wasmsrc[0].instance.exports
audio = PL5.wasmsrc[1].instance.exports

//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
//silakan bikin di sini


lih(PL5)
//
let uni = await render.getreso('uni')

let {
	allobjinfo,
	f_art,
} = await setallobjinfo(render,audio,)





//fill matrix
if(
	0
){
	for(let k in allobjinfo.inst_info){
		let stost = allobjinfo.inst_info[k].stost
		for(let inst of stost){
			for(let mat in inst){
				m4.identity(inst[mat])
			}
		}
	}
}



_camsetup0.init()




//resize
resize3dcanvas(persp,canv3d,)



//draw
let step = 0 //frame step
let t0 = 0
let env_t0 = 0
let draw = async t=>{
	if(ss <= ++step){
		step = 0
	}
	if(step){
		requestAnimationFrame(draw)
		return
	}
	let env_t = audio.envaugetTime()
	env_t *= 1000
	
	dt = -t0+t
	t0 = t
	env_dt = -env_t0+env_t
	env_t0 = env_t
	
	f_art(t)
	allobjinfo.write_inst()
	
	
	render.set_t(t,dt,env_t,env_dt,)
	
	//write storage
	render.write_sto(
		allobjinfo.msoff,
		allobjinfo.mssize,
	)
	
	
	
	//write uni
	render.write_uni(
		allobjinfo.muoff,
		uni.size,
	)
	
	
	
	//draw
	await render.draw()
	requestAnimationFrame(draw)
}





//draw
requestAnimationFrame(draw,0,)

//lainlain







floaded()

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


})()