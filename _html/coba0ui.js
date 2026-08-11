'use strict'

import {
	render,
	audio,
	dt,
	fstep,
	loaded,
} from './coba0.js'

import {
	lih,
	showfetch,
} from './coba0func.js'

import {
	_camsetup0,
} from './coba0class.js'

import {
	set_cam_ani,
} from './coba0art.js'





//mousetext
let moutex	= document.querySelector('#moutex'	)
let fmoutex = e=>{
	let x = Math.min(e.clientX+11,innerWidth-moutex.clientWidth,)
	let y = Math.min(e.clientY+11,innerHeight-moutex.clientHeight,)
	moutex.style.left = x+'px'
	moutex.style.top = y+'px'
	let shows = e.target.closest('[mousedescr]')?.getAttribute('mousedescr') ?? ''
	moutex.textContent = JSON.parse(`"${shows}"`)
}
addEventListener('pointermove',fmoutex,)
addEventListener('pointerdown',fmoutex,)






//menu
let menu	= document.querySelector('#menu'	)
let fmenu = e=>{
	e.target.closest('svg')?.classList.toggle('active')
}
menu.addEventListener('pointerdown',fmenu,)





//content
let content_hold = false
let fcontent = e=>{
switch(e.type){
	
	
	
	case 'click':
	if(
		e.detail%2 == 0 && //bisa spam doubleclick
		e.target === e.currentTarget 
	){
		_camsetup0.activecam.fcamreset()
	}
	break
	
	case 'pointerdown':
		if(
			e.target === e.currentTarget &&
			document.querySelector('#p_camera .active')
		){
			content_hold = true
		}
	break
	
	case 'pointermove':
	if(document.pointerLockElement === e.currentTarget){
		_camsetup0.pointermoving = true
	}else if(content_hold && !isPointerLockPending){
		isPointerLockPending = true;
		try{e.currentTarget.requestPointerLock({unadjustedMovement:true})}catch(error){}
	}
	break
	
	case 'pointerup':
		document.exitPointerLock()
		content_hold = false
		_camsetup0.pointermoving = false
	break
	
	
	
}
}

//p_timeline
let fps_name = [
	'kosonggg',
	'Max',
	'High',
	'Medium',
	'Low',
	'Lower',
	'Min',
]
let fplay = e=>{
	audio.envauplay()
}
let fpause = e=>{
	audio.envaupause()
}
let ss = 4 //skip steps
let ffps = e=>{
	if(6 <= ss++){
		ss = 1
	}
	fstep(ss)
	fpsmd()
}
let fpsmd = ()=>fps.attributes.mousedescr.value = 'Select FPS: '+fps_name[ss]
fstep(ss)
let time_hold = false
let ftime = e=>{
switch(e.type){
	
	
	
	case 'click':
	if(e.detail%2 == 0){//bisa spam doubleclick
		audio.envausetTime(0)
	}
	break
	
	case 'pointerdown':
		time_hold = true
	break
	
	case 'pointermove':
	if(document.pointerLockElement === e.currentTarget){
		let envt = audio.envaugetTime()
		envt += e.movementX/44*audio.envaugetSpeed()
		audio.envausetTime(envt)
	}else if(time_hold && !isPointerLockPending){
		isPointerLockPending = true;
		try{e.currentTarget.requestPointerLock({unadjustedMovement:true})}catch(error){}
	}
	break
	
	case 'pointerup':
		document.exitPointerLock()
		time_hold = false
	break
	
	
	
}
}
let speed_hold = false
let fspeed = e=>{
switch(e.type){
	
	
	
	case 'click':
	if(e.detail%2 == 0){
		audio.envausetSpeed(1)
	}
	break
	
	case 'pointerdown':
		speed_hold = true
	break
	
	case 'pointermove':
	if(document.pointerLockElement === e.currentTarget){
		let envs = audio.envaugetSpeed()
		let fac = 1.08
		envs = Math.log(envs)/Math.log(fac)
			envs += +e.movementX/44
		envs = fac**envs
		audio.envausetSpeed(envs)
	}else if(speed_hold && !isPointerLockPending){
		isPointerLockPending = true;
		try{e.currentTarget.requestPointerLock({unadjustedMovement:true})}catch(error){}
	}
	break
	
	case 'pointerup':
		document.exitPointerLock()
		speed_hold = false
	break
	
	
	
}
}

//p_camera
let fp_camera = ({
	type,
	target,
	currentTarget,
})=>{
	if(type === 'pointerdown'){
		let ac = currentTarget.querySelector('.active')
		let svg = target.closest('svg')
		if(svg){
			ac?.classList.remove('active')
			if(ac != svg){
				svg?.classList.add('active')
			}
		}
		_camsetup0.mode = currentTarget.querySelector('.active')?.id
	}
	fcontent({
		type,
		target:currentTarget,
		currentTarget,
	})
}

//p_timestamp
let fstamp = e=>{
	let chiarr = e.currentTarget.parentElement.children
	fstamp_fps({currentTarget:chiarr[1]})
	fstamp_time({currentTarget:chiarr[2]})
	fstamp_speed({currentTarget:chiarr[3]})
	fstamp_camera({currentTarget:chiarr[4]})
}
let fstamp_fps = e=>{
	let fpsv = +e.currentTarget.attributes.fps.value //fps value
	if(fpsv === NaN){return console.warn('value error: '+fpsv)}
	fstep(ss = fpsv)
	fpsmd()
}
let fstamp_time = e=>{
	let t = +e.currentTarget.textContent
	if(t === NaN){return console.warn('value error: '+t)}
	audio.envausetTime(t)	
}
let fstamp_speed = e=>{
	let s = +e.currentTarget.textContent
	if(
		s === NaN ||
		s <= 0 
	){return console.warn('value error: '+s)}
	audio.envausetSpeed(s)
}
let fstamp_camera = e=>{
	let cur = e.currentTarget
	let mesh = cur.attributes.mesh.value
	let instance = cur.attributes.instance.value
	let bone = cur.attributes.bone.value
	set_cam_ani(mesh,instance,bone,)
	
	p_camera.querySelector('.active')?.classList.remove('active')
}

//p_log
let p_log = document.querySelector('#p_log')
showfetch(p_log)




//
let play = document.querySelector('#play')	;play.addEventListener('pointerdown',fplay,)
let pause = document.querySelector('#pause')	;pause.addEventListener('pointerdown',fpause,)
let fps = document.querySelector('#fps')	;fps.addEventListener('pointerdown',ffps,)
let time = document.querySelector('#time')	;time.addEventListener('pointerdown',ftime,)	;time.addEventListener('pointermove',ftime,)	;time.addEventListener('pointerup',ftime,)	;time.addEventListener('click',ftime,)
let speed = document.querySelector('#speed')	;speed.addEventListener('pointerdown',fspeed,)	;speed.addEventListener('pointermove',fspeed,)	;speed.addEventListener('pointerup',fspeed,)	;speed.addEventListener('click',fspeed,)

let content = document.querySelector('#content')	;content.addEventListener('pointerdown',fcontent,)	;content.addEventListener('pointermove',fcontent,)	;content.addEventListener('pointerup',fcontent,)	;content.addEventListener('click',fcontent,)

let p_camera = document.querySelector('#p_camera')	;p_camera.addEventListener('pointerdown',fp_camera,)	;p_camera.addEventListener('pointermove',fp_camera,)	;p_camera.addEventListener('pointerup',fp_camera,)	;p_camera.addEventListener('click',fp_camera,)
let timestamp = document.querySelector('#p_timestamp tbody')


for(let {children:[
	tdname,
	tdfps,
	tdtime,
	tdspeed,
	tdcamera,
]} of timestamp.children){
	
	tdfps.textContent = fps_name[+tdfps.attributes.fps.value] //sampe sini
	
	tdname	.addEventListener('pointerdown',fstamp	,)
	tdfps	.addEventListener('pointerdown',fstamp_fps	,)
	tdtime	.addEventListener('pointerdown',fstamp_time	,)
	tdspeed	.addEventListener('pointerdown',fstamp_speed	,)
	tdcamera	.addEventListener('pointerdown',fstamp_camera	,)
}


//
let isPointerLockPending = false;
let fpoilock = e=>{
    isPointerLockPending = false;
	content_hold = false
	_camsetup0.pointermoving = false
	time_hold = false
	speed_hold = false
    // Handle lock change
}
document.addEventListener('pointerlockchange', fpoilock,)
document.addEventListener('pointerlockerror', fpoilock,)



//
setInterval(()=>{
	//p_timeline
	fps.firstChild.textContent = Math.round(1000/dt)
	time.textContent = audio?.envaugetTime().toFixed(3)
	speed.textContent = audio?.envaugetSpeed().toFixed(3)
},111,)
loaded.then(()=>{
	//click timestamp pertama
	//fstamp_camera({currentTarget:timestamp.firstElementChild.lastElementChild,})
	fstamp({currentTarget:document.querySelector('#p_timestamp tbody td:first-child')})
	document.querySelector('#m_log').classList.remove('active')
	document.querySelector('#m_timeline').classList.add('active')
	m_timeline.classList.add('active')
	
})