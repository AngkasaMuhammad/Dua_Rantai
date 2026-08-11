
(module
	
	;;warna Language: Notepad++ ==>> Ada
	;;(global $str (import "myStrings" "") externref)

(global $str_bufkosong (import "myStrings" "_bufkosong") externref)
(global $struint16 (import "myStrings" "uint16") externref)
(global $strmem (import "myStrings" "wasmmem") externref)
(memory $mem (import "memory" "wasmmem") 1)



	(import "main" "lihat" (func $lih (param externref)))
;;	(import "main" "getreso" (func $getreso (param externref) (result externref)))
	(func $getreso (export "getreso") (import "main" "getreso") (param externref) (result externref))
	(import "main" "wb" (func $wb (param externref i32 externref i32 i32)))
	(func $rct (export "resize_canvas")(import "main" "rct")(param i32 i32)(result externref))
	
	(import "main" "cce" (func $cce (param externref))) ;;createCommandEncoder
		(import "main" "brp" (func $brp (param externref))) ;;beginRenderPass
			(import "main" "sp" (func $sp (param externref))) ;;setPipeline
			(import "main" "svb" (func $svb (param i32 externref i32 i32))) ;;setVertexBuffer
			(import "main" "sib" (func $sib (param externref externref i32 i32))) ;;setIndexBuffer
			(import "main" "sbg" (func $sbg (param i32 externref))) ;;setBindGroup
			(import "main" "draw" (func $draw (param i32 i32 i32 i32))) ;;draw
			(import "main" "di" (func $di (param externref i32))) ;;drawIndirect
			(import "main" "dii" (func $dii (param externref i32))) ;;drawIndexedIndirect
			(import "main" "end" (func $end)) ;;end
		(import "main" "cttt" (func $cttt (param externref externref))) ;;
		(import "main" "finish" (func $finish)) ;;finish
	(import "main" "submit" (func $submit (result externref))) ;;submit

	;;(global $str (import "myStrings" "") externref)


;;(global $strsamplerbind (import "myStrings" "samplerbind") externref)
	
	;;enco0
	(global $strenco0 (import "myStrings" "enco0") externref)
		(global $strmeshrp (import "global" "mesh rp") (mut externref))
		(global $strobjv (import "myStrings" "_objectv") externref)
		(global $strobji (import "myStrings" "_objecti") externref)
		(global $strobjind (import "myStrings" "_objectind") externref)
		(global $strbind0 (import "myStrings" "bind0") externref)
		(global $strsto (import "myStrings" "_objectsto") externref)
		(global $struni (import "myStrings" "uni") externref)
			
		;;chara
		(global $strchara0pipe (import "global" "chara0_pipe") (mut externref))
		(global $chara0voff (import "global" "_object_chara0_voff") (mut i32))
		(global $chara0instoff (import "global" "_object_chara0_instoff") (mut i32))
		(global $chara0indroff (import "global" "chara0_indroff") (mut i32))
			
		;;cam
		(global $strcampipe (import "global" "cam_pipe") (mut externref))
		(global $camvoff (import "global" "_object_cam_voff") (mut i32))
		(global $caminstoff (import "global" "_object_cam_instoff") (mut i32))
		(global $camindroff (import "global" "cam_indroff") (mut i32))
			
		;;stick
		(global $strstickpipe (import "global" "stick_pipe") (mut externref))
		(global $stickvoff (import "global" "_object_stick_voff") (mut i32))
		(global $stickinstoff (import "global" "_object_stick_instoff") (mut i32))
		(global $stickindroff (import "global" "stick_indroff") (mut i32))
			
		;;wave
		(global $strwavepipe (import "global" "wave_pipe") (mut externref))
		(global $wavevoff (import "global" "_object_wave_voff") (mut i32))
		(global $waveinstoff (import "global" "_object_wave_instoff") (mut i32))
		(global $waveindroff (import "global" "wave_indroff") (mut i32))
			
		;;bunga
		(global $strbungapipe (import "global" "bunga_pipe") (mut externref))
		(global $bungavoff (import "global" "_object_bunga_voff") (mut i32))
		(global $bungainstoff (import "global" "_object_bunga_instoff") (mut i32))
		(global $bungaindroff (import "global" "bunga_indroff") (mut i32))
			
		;;pecut
		(global $strpecutpipe (import "global" "pecut_pipe") (mut externref))
		(global $pecutvoff (import "global" "_object_pecut_voff") (mut i32))
		(global $pecutinstoff (import "global" "_object_pecut_instoff") (mut i32))
		(global $pecutindroff (import "global" "pecut_indroff") (mut i32))
			
		;;tanah
		(global $strtanahpipe (import "global" "tanah_pipe") (mut externref))
		(global $tanahvoff (import "global" "_object_tanah_voff") (mut i32))
		(global $tanahinstoff (import "global" "_object_tanah_instoff") (mut i32))
		(global $tanahindroff (import "global" "tanah_indroff") (mut i32))
			
		;;tank
		(global $strtankpipe (import "global" "tank_pipe") (mut externref))
		(global $tankvoff (import "global" "_object_tank_voff") (mut i32))
		(global $tankinstoff (import "global" "_object_tank_instoff") (mut i32))
		(global $tankindroff (import "global" "tank_indroff") (mut i32))


;;uniform other -==-=-=-=-==--==-=-=-=-=-=-==-=-=-=-=-=-=-==-=-=-=-==-=-=-=-==--==-=-=-=-=-=-==-=-=-=-=-=-=-==-=-=-=

(global $_uni_arahsinar (import "global" "_uni_arahsinar") (mut i32))


	(global $t (mut i32) (i32.const 0))
	(global $dt (mut i32) (i32.const 0))
	(global $env_t (mut i32) (i32.const 0))
	(global $env_dt (mut i32) (i32.const 0))

(;========
(func $inittt
	
	call $drawall
	drop
)
(start $inittt)
--------;)

(func $set_t (export "set_t")
	(param $t1 i32)
	(param $dt1 i32)
	(param $env_t1 i32)
	(param $env_dt1 i32)
	
		local.get $t1
	global.set $t
		local.get $dt1
	global.set $dt
		local.get $env_t1
	global.set $env_t
		local.get $env_dt1
	global.set $env_dt
	;;sampe sini
)

(func $wb_inst_chara0 (export "write_inst_chara0")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $chara0instoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_cam (export "write_inst_cam")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $caminstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_stick (export "write_inst_stick")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $stickinstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_wave (export "write_inst_wave")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $waveinstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_bunga (export "write_inst_bunga")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $bungainstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_pecut (export "write_inst_pecut")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $pecutinstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_tanah (export "write_inst_tanah")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $tanahinstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_inst_tank (export "write_inst_tank")
	(param $memoff i32)
	(param $size i32)
	
		global.get $strobjv
		global.get $tankinstoff
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_sto (export "write_sto")
	(param $memoff i32)
	(param $size i32)
		
		
	
	
		global.get $strsto
		i32.const 0
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

(func $wb_uni (export "write_uni")
	(param $memoff i32)
	(param $size i32)
		
		local.get $memoff
	call $set_uo
	
		global.get $struni
		i32.const 0
		global.get $strmem
		local.get $memoff
		local.get $size
	call $wb
)

;;*=*=*=*=**=*=*=*=*=*==*=**=*=**

(func $set_uo ;;uniform other
	(param $memoff i32)
	
;;arahsinar
			local.get $memoff
			i32.const 160 ;;lokasi extra
		i32.add
		global.get $_uni_arahsinar
	i32.store8 $mem
	
;;time
			local.get $memoff
			i32.const 164;;lokasi time
		i32.add
		global.get $t
	i32.store $mem
	
;;delta time
			local.get $memoff
			i32.const 168;;lokasi delta time
		i32.add
		global.get $dt
	i32.store $mem
	
;;env time
			local.get $memoff
			i32.const 172;;lokasi env time
		i32.add
		global.get $env_t
	i32.store $mem
	
;;env delta time
			local.get $memoff
			i32.const 176;;lokasi delta env time
		i32.add
		global.get $env_dt
	i32.store $mem
)

	(func $drawall (export "draw")
		(result externref)
		
;;`````````````````````````|
		call $enco_enco0
;;_________________________|
		
		call $submit
	)

	(func $enco_enco0
		;;enco0 +++++++++++++++++++
		global.get $strenco0
		call $cce
		
;;`````````````````````````|
		call $rp_enco0mesh
;;_________________________|
		
		call $finish
	)

;;https://chatgpt.com/share/69789b9b-1c0c-8011-aeab-4e91e0672f19

(;========
(func $batas
  (param $min f32)
  (param $val f32)
  (param $max f32)
  (result f32)

  (local $range f32)
  (local $k f32)

  ;; range = max - min
  local.get $max
  local.get $min
  f32.sub
  local.set $range

  ;; k = floor((val - min) / range)
  local.get $val
  local.get $min
  f32.sub
  local.get $range
  f32.div
  f32.floor
  local.set $k

  ;; result = val - range * k
  local.get $val
  local.get $range
  local.get $k
  f32.mul
  f32.sub
)
--------;)

	(func $rp_enco0mesh
		;;mesh +++++++++++++++++++
		global.get $strmeshrp
		call $brp
		
		global.get $strobji
		global.get $struint16
		i32.const 0
		i32.const -333 ;;omitted
		call $sib
		
		i32.const 0
		global.get $strbind0
		call $sbg
			
;;`````````````````````````|
			call $draw_enco0meshchara0
			call $draw_enco0meshstick
			call $draw_enco0meshbunga
			call $draw_enco0meshtanah
			call $draw_enco0meshtank
;;_________________________|
			
		call $end
	)

	(func $draw_enco0meshchara0
		;;chara0+++++++++++++++++++
		
		i32.const 0
		global.get $strobjv
		global.get $chara0voff
		i32.const -333 ;;omitted
		call $svb
			
		i32.const 1
		global.get $strobjv
		global.get $chara0instoff
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strchara0pipe
		call $sp
		
		global.get $strobjind
		global.get $chara0indroff
		call $dii
	)

	(func $draw_enco0meshstick
		;;stick+++++++++++++++++++
		
		i32.const 0
		global.get $strobjv
		global.get $stickvoff
		i32.const -333 ;;omitted
		call $svb
			
		i32.const 1
		global.get $strobjv
		global.get $stickinstoff
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strstickpipe
		call $sp
		
		global.get $strobjind
		global.get $stickindroff
		call $dii
	)

	(func $draw_enco0meshbunga
		;;bunga+++++++++++++++++++
		
		i32.const 0
		global.get $strobjv
		global.get $bungavoff
		i32.const -333 ;;omitted
		call $svb
			
		i32.const 1
		global.get $strobjv
		global.get $bungainstoff
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strbungapipe
		call $sp
		
		global.get $strobjind
		global.get $bungaindroff
		call $dii
	)

	(func $draw_enco0meshtanah
		;;tanah+++++++++++++++++++
		
		i32.const 0
		global.get $strobjv
		global.get $tanahvoff
		i32.const -333 ;;omitted
		call $svb
			
		i32.const 1
		global.get $strobjv
		global.get $tanahinstoff
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strtanahpipe
		call $sp
		
		global.get $strobjind
		global.get $tanahindroff
		call $dii
	)

	(func $draw_enco0meshtank
		;;tank+++++++++++++++++++
		
		i32.const 0
		global.get $strobjv
		global.get $tankvoff
		i32.const -333 ;;omitted
		call $svb
			
		i32.const 1
		global.get $strobjv
		global.get $tankinstoff
		i32.const -333 ;;omitted
		call $svb
		
		global.get $strtankpipe
		call $sp
		
		global.get $strobjind
		global.get $tankindroff
		call $dii
	)

;;=+=+=+=+=+=+=+=+=+=+=+=+=
)
