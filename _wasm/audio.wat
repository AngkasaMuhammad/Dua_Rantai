
(module

	(func $fxauplay (import "main" "fxauplay" ) (param externref) (result externref))
	(func $fxaustop (export "fxaustop") (import "main" "fxaustop" ) (param externref) (result externref))
	(func $fxausetLR (import "main" "fxausetLR" ) (param externref i32 f32 f32) (result externref))
	
	(func $envad (export "envad") (import "main" "envad" ) (param externref)) ;;param audio_controller
	(func $envauplay (export "envauplay") (import "main" "envauplay"))
	(func $envaupause (export "envaupause") (import "main" "envaupause"))
	(func $envausetLR (import "main" "envausetLR") (param i32 f32 f32))
	(func $envausetTime (export "envausetTime") (import "main" "envausetTime") (param f32))
	(func $envaugetTime (export "envaugetTime") (import "main" "envaugetTime") (result f32))
	(func $envausetSpeed (export "envausetSpeed") (import "main" "envausetSpeed") (param f32))
	(func $envaugetSpeed (export "envaugetSpeed") (import "main" "envaugetSpeed") (result f32))
	(func $envaucount (export "envaucount") (import "main" "envaucount") (result i32))

	(func $getreso (import "main" "getreso") (param externref) (result externref))

(func (export "fxsetpos")
	(param $cont externref) (param $x f32) (param $y f32) (param $z f32) (param $r f32) (param $i i32)
	(result externref)
	
		local.get $cont
		local.get $i
			local.get $x
			local.get $y
			local.get $z
			local.get $r
		call $setLR
	call $fxausetLR
)

(func (export "envsetpos")
	(param $x f32) (param $y f32) (param $z f32) (param $r f32) (param $i i32)
	
		local.get $i
			local.get $x
			local.get $y
			local.get $z
			local.get $r
		call $setLR
	call $envausetLR
)

(func $setLR
	(param $x f32) (param $y f32) (param $z f32) (param $r f32)
	(result f32 f32)
	(local $xn f32) (local $yn f32) (local $zn f32) (local $L f32) (local $R f32)

	;; normalize
		local.get $x
		local.get $r
	f32.div
	local.set $xn

		local.get $y
		local.get $r
	f32.div
	local.set $yn

		local.get $z
		local.get $r
	f32.div
	local.set $zn

	;; L = 1 / (distSq3(x,y,z,-1,0,0) + 1)
		f32.const 1
			f32.const 1
				local.get $xn
				local.get $yn
				local.get $zn
				f32.const -1
				f32.const 0
				f32.const 0
			call $distSq3
		f32.add
	f32.div
	local.set $L

	;; R = 1 / (distSq3(x,y,z, 1,0,0) + 1)
		f32.const 1
			f32.const 1
				local.get $xn
				local.get $yn
				local.get $zn
				f32.const 1
				f32.const 0
				f32.const 0
			call $distSq3
		f32.add
	f32.div
	local.set $R

	;; envausetLR(i, L, R)
		local.get $L
		local.get $R
)

(func $distSq3
	(param $x f32) (param $y f32) (param $z f32)
	(param $ax f32) (param $ay f32) (param $az f32)
	(result f32)

		;; (x-ax)^2
			local.get $x
			local.get $ax
		f32.sub
			local.get $x
			local.get $ax
		f32.sub
	f32.mul

		;; (y-ay)^2
			local.get $y
			local.get $ay
		f32.sub
			local.get $y
			local.get $ay
		f32.sub
	f32.mul
	f32.add

		;; (z-az)^2
			local.get $z
			local.get $az
		f32.sub
			local.get $z
			local.get $az
		f32.sub
	f32.mul
	f32.add
)


)
