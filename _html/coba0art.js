
'use strict'


import {
	_camsetup0,
} from './coba0class.js'


import {
	lih,
	objinfo,
	boneinfl,
	animate,
	acaku,
	acakf,
	tsvToObj,
	set_action_info,
	wrap,
	modulo,
	animate_wasm_globals,
} from './coba0func.js'


import {
	mat4 as m4,
	//vec4 as v4,
	vec3 as v3,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

let render
let audio
let meshrp
let inst_info
let uni_other
let cam
let env
let aucon_env
let ani_bone
let strip_bone
let ani_uni
let ani_uni_dict

export let persp = m4.identity()
let cammic = m4.identity()
let decoder = new TextDecoder('utf-8')

let cam_mesh = ''
let inst_i = 0
let cam_bone = ''
export let set_cam_ani = (m,i,b,)=>{
	cam_mesh= m
	inst_i = i
	cam_bone = b
}
//https://chat.deepseek.com/share/ygwn8y19v04k967x9a
const getAvgAxisSize = m=>(
	Math.hypot(m[0],m[1],m[2])
	+Math.hypot(m[4],m[5],m[6])
	+Math.hypot(m[8],m[9],m[10])
)/3


export let setallobjinfo = async (param_render,param_audio,)=>{
	
	render = param_render
	audio = param_audio
	audio.envad('aucon_env')
	audio.envauplay()
	
	let mesh_info = await render.getreso('mesh_info')
	mesh_info = decoder.decode(mesh_info.buffer)
	mesh_info = tsvToObj(mesh_info,'name',)
	
	let uni_other_struct = await render.getreso('uni_other_struct')
	let allobjinfo = await objinfo(
		render,
		mesh_info,
		'wasmmem',
		uni_other_struct,
/*========
		{//uni_other
			'cammat'	:[Float32Array	,16	,],
			'wb'	:[Float32Array	,4	,],
			'ws'	:[Float32Array	,4	,],
			'extra'	:[Uint8Array	,4	,], //arahsinar pad pad pad
		},
--------*/
	)
	;({
		inst_info,
		uni_other,
	} = lih(allobjinfo))
	
	
	ani_bone = await render.getreso('ani_bone')
	ani_bone = decoder.decode(ani_bone.buffer)
	ani_bone = tsvToObj(ani_bone,null,)
	
	strip_bone = await render.getreso('strip_bone')
	strip_bone = decoder.decode(strip_bone.buffer)
	strip_bone = tsvToObj(strip_bone,null,)
	let acinedited = [] //action info edited
	for(let strip of strip_bone){
		let acin = await render.getreso(strip.action_info)
		if(!(acinedited.includes(acin))){
			set_action_info(render,acin,)
			acinedited.push(acin)
		}
		strip.action_info = acin
		strip.trimstart = +strip.trimstart
		strip.trimend = +strip.trimend
		strip.scale = +strip.scale
		strip.start = +strip.start
		strip.end = +strip.end
	}
	lih(strip_bone)
	
	let ani_uni = await render.getreso('ani_uni')
	ani_uni = decoder.decode(ani_uni.buffer)
	ani_uni = tsvToObj(ani_uni,null,)
	ani_uni_dict = {}
	for(let {
		value,
		time,
		wasm_dst,
	} of ani_uni){
		let glo = await render.getreso(wasm_dst)
		let aum = null
		if(!(wasm_dst in ani_uni_dict)){
			ani_uni_dict[wasm_dst] = {
				glo,
				framearr:[],
			}
		}
		ani_uni_dict[wasm_dst].framearr.push([+time,value,])
	}
	
	//urutkan
	for(let wasm_dst in ani_uni_dict){
		ani_uni_dict[wasm_dst]
		.framearr
		.sort( (a,b,)=>a[0]-b[0] )
	}
	lih(ani_uni_dict)
	
	
	
	
	
	
	
	
	meshrp = await render.getreso('mesh rp') //

cam = _camsetup0.activecam = new _camsetup0(uni_other.cammat,cammic,)
aucon_env = await render.getreso('aucon_env')

	return {
		allobjinfo,
		f_art,
	}
	
	
}

let f_art = t=>{
	//pake env time
	t = audio.envaugetTime()*1000
	
	
	//bone
	let trackdict = {}
	
	//strip_bone
	for(let {
		action_info,
		slot,
		trimstart,
		trimend,
		scale,
		start,
		end,
		track,
	} of strip_bone){
		if(
			t < start ||
			end < t ||
			track in trackdict
		){continue}
		
		let t1 = t
		t1 -= start
		t1 /= scale //sampe sini, scale bikin salah mulai frame
		t1 += trimstart
		t1 = wrap(trimstart,t1,trimend,)
		
		trackdict[track] = animate(
			action_info,
			slot,
			t1,
		)
	}
	let anirepbone = {} //mesh->instance->replaced bones
	for(let {
		track,
		mesh,
		instance_index,
	} of ani_bone){
		let track1 = trackdict[track]
		for(let track_b in track1){
			let inst = anirepbone
			inst = (inst[mesh] ??= {})
			inst = (inst[instance_index] ??= {})
			if(inst_info[mesh].parlay.has(track_b)){
				inst[track_b] ??= track1[track_b]
			}
		}
	}
	for(let mesh in anirepbone){
		let mesh1 = anirepbone[mesh]
		for(let inst in mesh1){
			let inst1 = mesh1[inst]
			boneinfl(
				inst1,
				inst_info[mesh].parlay,
				+inst,
				inst_info[mesh].stost,
			)
		}
	}
	
	
	
	//camera
	if(document.querySelector('#p_camera .active')){
		cam.fcam(persp)
	}else{
		//m4.invert( inst_info[cam_mesh].stost[inst_i][cam_bone] ,uni_other.cammat ,)
		let cammat1 = uni_other.cammat
		if(!cammat1.some(Number.isNaN)){
			let b1 = inst_info[cam_mesh].stost[inst_i][cam_bone]
			let inv1 = inst_info[cam_mesh].parlay.get(cam_bone).arm_sp_inv
			
			m4.invert( inv1, cammat1,) //arm_sp
			m4.mul(b1,cammat1,cammat1,)
			m4.invert(cammat1 ,cammat1 ,)
			m4.copy(cammat1,cammic,)
			
			m4.mul( persp ,cammat1 ,cammat1 ,)
		}
	}
	
	
	









	//ANIMASI SEMENTARA
	//.tsv untuk: (global & value) render pass, pipe, uniform
	animate_wasm_globals(ani_uni_dict,t,)
	
	//sampe sini, animasi uniform
	
	
	//envaudio
	//matrix animasi, masih lokal, posisi suara geser
	for(let i in aucon_env){
		let {mesh,instance_index,bone,} = aucon_env[i]
		let b = inst_info[mesh].stost[instance_index][bone] //final 
		let cam1 = m4.invert(inst_info[mesh].parlay.get(bone).arm_sp_inv)
		m4.mul(b,cam1,cam1,) //sebelum dikali arm_sp_inv
		let pos = m4.getTranslation(cam1)
		let radius = getAvgAxisSize(cam1)
		
		v3.transformMat4(pos,cammic,pos,)
		audio.envsetpos(
			...pos,
			radius,
			+i,
		)
	}
	



/*========
	//instanced vertex
	for(let inst of inst_info.Cube.ivst){
		//inst.coba_inst_warna.set([0,222,0,222,])
		inst.coba_inst_warna.set([
			acaku(256),
			acaku(256),
			acaku(256),
			acaku(256),
		])
		//inst.coba_inst_xyz.set([-.5,.5,.5,])
		inst.coba_inst_xyz.set([
			acakf(.01),
			acakf(.01),
			acakf(.01),
		])
		
	}
	for(let inst of inst_info.donat.ivst){
		inst.xyz.set([
			acakf(.01),
			acakf(.01),
			acakf(.01),
		])
	}
	
	
	//warna sinar
	uni_other.ws.set([1.,1.,1.,1.,])
	
	
	//arahsinar pad pad pad
	uni_other.extra[0] = 222 // +Math.round(t*.008)
	
--------*/
	
	
}
