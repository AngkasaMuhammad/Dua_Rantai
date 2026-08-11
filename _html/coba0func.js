"use strict"

import {
	mat4 as m4,
	//vec4 as v4,
	vec3 as v3,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';




export let lih = a=>{
	console.groupCollapsed(a)
	console.trace(a)
	console.groupEnd()
	return a
}
export let matide = m4.identity()
export let modulo = (n,m,)=>((n % m) + m) % m
export let wrap = (min,v,max,)=>modulo(v-min,-min+max,)+min
export let acakf = v=>(Math.random()*2-1)*v //float
export let acaku = v=>Math.floor(Math.random()*v) //uint
export let stinfo = st=>{
	let last = st.at(-1)
	let min = Number.MAX_SAFE_INTEGER //offset
	let max = 0
	let key = ''
	for(key in st[0]){
		min = Math.min( min, st[0][key].byteOffset, )
	}
	for(key in last){
		max = Math.max( max, last[key].byteOffset, )
	}
	if(min === Number.MAX_SAFE_INTEGER){
		return [0,0,]
	}
	max += last[key].byteLength
	return [
		min, //offset
		-min+max, //size
	]
}
export let objinfo = async (
	render,
	allinfo,
	wasmem,
	uni_other,
)=>{
	
	let wasmmembuf = (await render.getreso('wasmmem')).buffer
	
	let ivdict = {}
	let stodict = {}
	let inst_info = {}
	for(let k in allinfo){
		inst_info[k] = {
			ivst:ivdict[k] = await render.getreso(allinfo[k].ivst),
			stost:stodict[k] = await render.getreso(allinfo[k].stost),
			parlay:sortObjectByParent(await render.getreso(allinfo[k].parlay)),
			pipe:await render.getreso(allinfo[k].pipe), //ini variable, bukan value
		}
	}
	
	
	
	let msoff = Number.MAX_SAFE_INTEGER //mem sto, memory punya storage di offset
	let mssize = 0
	let wgslbone_size = 0
	
	for(let k in ivdict){
		let out = stinfo(ivdict[k])
		
		inst_info[k].mivoff = out[0] //mem instancedVertex, memory punya instancedVertex di offset
		inst_info[k].mivsize = out[1]
		
	}
	
	for(let k in stodict){
		let stost = stodict[k]
		let [
			offset1,
			size1,
		] = stinfo(stost)
		
		let info = inst_info[k]
		info.bone_stride = Object.keys(stost[0]).length
		info.bone_offset = wgslbone_size
		
		msoff = Math.min( offset1, msoff, )
		mssize += size1
		wgslbone_size += stost.length*info.bone_stride
		
	}
	let write_inst = ()=>{
		for(let k in allinfo){
			render[allinfo[k].write_inst](
				inst_info[k].mivoff,
				inst_info[k].mivsize,
			)
		}
	}
	let muoff = msoff+mssize
	let uniso = new Uint32Array(
		wasmmembuf,
		muoff,
		Math.ceil((
			Object.values(inst_info).length*2
		)/4)*4, //uniform harus digeser tiap 16 byte (4 uint)
	)
	let iiarr = Object.values(inst_info)
	for(let k in iiarr){
		k = +k
		uniso.set([
			iiarr[k].bone_stride,
			iiarr[k].bone_offset,
		],k*2,)
	}
	
	
	//uni_other
	let off0 = muoff+uniso.byteLength
	for(let k in uni_other){
		//uni_other[k] = new uni_other[k][0](
		uni_other[k] = new window[uni_other[k][0]](
			wasmmembuf,
			off0,
			uni_other[k][1],
		)
		off0 += uni_other[k].byteLength
	}
	
	
	return ({
		uniso,
		write_inst,
		inst_info,
		msoff,
		mssize,
		muoff,
		uni_other,
	})
}
export let boneinfl = (

	//src
	anidict, //matrix  dict, animated
	parlay, //parents layout
	inst_i, //instance index
	
	//dst
	stost,
)=>{
	let inst_arm = stost[inst_i]
	
	if(!anidict){
		return 
	}
	
	//arm_sp
	for(let kbone in inst_arm){
		if(!(kbone in anidict)){continue}
		
		let kpar = parlay.get(kbone).parent
		
		let inst_bone = inst_arm[kbone] //arm_sp
		let inst_par = kpar ? inst_arm[kpar] : matide //arm_sp
		
		/// rumus -->> out = par_sp*ani
		m4.mul(
			inst_par,
			parlay.get(kbone).par_sp,
			inst_bone,
		)
		m4.mul(//sampe sini, badan mundur ,lainnya ketinggalan, harus ikut
			inst_bone,
			anidict[kbone],
			inst_bone,
		)
	}
	//invert
	for(let kbone in inst_arm){
		if(!(kbone in anidict)){continue}
		
		let inst_bone = inst_arm[kbone] //arm_sp
		m4.mul(
			inst_bone,
			parlay.get(kbone).arm_sp_inv,
			inst_bone,
		)
	}
}
// https://chat.deepseek.com/share/efzzaf0pl3zqej9lpk
export let sortObjectByParent = obj=> {
	// Build children map and identify roots
	const childrenMap = {};
	const roots = [];
	
	// First pass: find roots and build parent-child relationships
	Object.keys(obj).forEach(key => {
		const item = obj[key];
		if (item.parent === null || !obj[item.parent]) {
			roots.push(key);
		}
		if (item.parent && obj[item.parent]) {
			if (!childrenMap[item.parent]) {
				childrenMap[item.parent] = [];
			}
			childrenMap[item.parent].push(key);
		}
	});
	
	// Depth-first traversal to get sorted keys
	const sortedKeys = [];
	function traverse(nodeKey) {
		sortedKeys.push(nodeKey);
		if (childrenMap[nodeKey]) {
			childrenMap[nodeKey].forEach(child => traverse(child));
		}
	}
	roots.forEach(root => traverse(root));
	
	// Add any remaining nodes (handles circular references or orphans)
	Object.keys(obj).forEach(key => {
		if (!sortedKeys.includes(key)) sortedKeys.push(key);
	});
	
	// Build and return Map
	const resultMap = new Map();
	sortedKeys.forEach(key => {
		resultMap.set(key, obj[key]);
	});
	return resultMap;
}
export let set_action_info = async (render,json,)=>{
	let data = json.data = await render.getreso(json.data)
	let mm = json.min_max = {}
	for(let k0 in json.info){
		let islot = json.info[k0]
		let min = Number.MAX_SAFE_INTEGER
		let max = Number.MIN_SAFE_INTEGER
		for(let k1 in islot){
			let [offset,size,] = islot[k1]
			min = Math.min(min,new Int32Array(data.buffer,((offset+0	)*17+0)*4,1,)[0],)
			max = Math.max(max,new Int32Array(data.buffer,((offset+size-1	)*17+0)*4,1,)[0],)
		}
		mm[k0] = {min,max,}
	}
	lih(json)
}
export let animate = (json,slot,t,)=>{
	
	let info = json.info
	let data = json.data
	
	if(!(slot in info)){ //validation
		throw 'Slot '+slot+' not found'
	}
	
	
	let ani = {}
	
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
	
	return ani
}
export let animate_wasm_globals = (data,t,)=>{
	for(let k in data){
		let {glo,framearr,} = data[k]
		let size = framearr.length
		//cari frame
		let l = 0
		let m = 0
		let r = size
		for(let i = 0;i < size;i++){
			m = Math.floor((l+r)/2)
			if(l === m){break}
			;(framearr[m][0] < t)
			?(l = m)
			:(r = m)
		}
		glo.value = framearr[l][1]
	}
}
export let showfetch = fetchinfo=>{ // DETECT FETCHES
	//console.log(fetchinfo)
	let show = (mes,color,)=>{
		//console.log(mes)
		let div = document.createElement('div')
		div.textContent = mes
		div.style.color = color
		fetchinfo.appendChild(div)
		fetchinfo.scroll(0,Number.MAX_SAFE_INTEGER,)
	}
	new PerformanceObserver((list) => {
		list.getEntries().forEach((entry) => {
			if (entry.initiatorType === "fetch") {
				show(
					'+-+- fetching.... '+entry.name,
					'#77ff77ff',
				)
			}
		});
	}).observe({ entryTypes: ["resource"] });
	addEventListener("unhandledrejection",e=>{
		lih(e)
		show(e.reason,'#ff7777ff',)
	},)
	
	showfetch = 'single use'
}



export let resize3dcanvas = ''
;{
	let resizenow = false
	let canvw = 0
	let canvh = 0
	let canvarea = 111111*6 //sekitar 1000*700
	let persp = null
	let canv3d = null
	resize3dcanvas = (persp0,canv3d0,)=>{
		persp = persp0
		canv3d = canv3d0
		addEventListener('resize',fresize, )
		fresize()
		resize3dcanvas = 'single use'
	}
	
	let fresize = () => {
		
		const sw = canv3d.clientWidth
		const sh = canv3d.clientHeight
	
		let aspect = sw / sh
		canvw = Math.round(Math.sqrt(canvarea * aspect))
		canvh = Math.round(Math.sqrt(canvarea / aspect))
		m4.perspectiveReverseZ(
			.9, //fov (rad)
			aspect,//aspect ratio
			.01, //zNear
			Number.MAX_SAFE_INTEGER, //zFar
		persp,)
		resizenow = true
	}
}






let strnewline = /\r\n|\r|\n/
export let tsvToObj = (tsv, key = null) => {
	const [header, ...rows] =
		tsv//.trim()
			.split(strnewline)
			.map(r => r.split('\t'));

	if (key === null) {
		// Return an array of objects
		return rows.map(row =>
			Object.fromEntries(
				header.map((col, i) => [col, row[i]])
			)
		);
	} else {
		// Return an object keyed by the given column name
		const keyIndex = header.indexOf(key);
		if (keyIndex === -1)
			throw new Error(`Key "${key}" not found in header`);

		return rows.reduce((out, row) => {
			out[row[keyIndex]] = Object.fromEntries(
				header
					.map((col, i) => [col, row[i]])
					.filter(([col]) => col !== key)
			);
			return out;
		}, {});
	}
};
