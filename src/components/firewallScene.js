export async function mountFirewall(host, canvas, context, reduce, onReady, onFailure) {
  const { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, DirectionalLight, PointLight, Box3, Vector3, Group, ACESFilmicToneMapping, SRGBColorSpace } = await import('three')
  const [{ GLTFLoader }, { OrbitControls }, { RoomEnvironment }, { PMREMGenerator }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/environments/RoomEnvironment.js'),
    import('three'),
  ])
  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.5
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new Scene()
  // A neutral studio reflection so the scanned chassis reads as metal instead of a flat dark lump.
  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture
  scene.environmentIntensity = .35
  pmrem.dispose()
  const camera = new PerspectiveCamera(35, 1, .01, 100)
  camera.position.set(3, 1.7, 4)
  // Console lighting: dim cool fill, crisp key, strong phosphor-amber rims so the chassis edges glow.
  scene.add(new HemisphereLight(0xc8d4e0, 0x2a1d0c, 2.2))
  const key = new DirectionalLight(0xfff1de, 4)
  key.position.set(2.5, 4, 3.5)
  scene.add(key)
  const rim = new DirectionalLight(0xffaa3c, 7)
  rim.position.set(-3.5, 1.6, -2.5)
  scene.add(rim)
  const rim2 = new DirectionalLight(0xffbf6b, 3.5)
  rim2.position.set(3.5, .8, -3)
  scene.add(rim2)
  // Fill rides with the camera, so whichever face auto-rotate turns toward the viewer stays readable.
  const fill = new DirectionalLight(0xe8eef5, 2.6)
  fill.position.set(.5, .6, 1)
  camera.add(fill)
  scene.add(camera)
  const glow = new PointLight(0xffaa3c, 6, 6, 2)
  glow.position.set(0, -.6, 1.4)
  scene.add(glow)
  const pivot = new Group()
  scene.add(pivot)
  const controls = new OrbitControls(camera, canvas)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = false
  controls.autoRotate = !reduce
  controls.autoRotateSpeed = .5
  // Preserve vertical page scrolling while horizontal gestures rotate the appliance.
  canvas.style.touchAction = 'pan-y'
  canvas.tabIndex = 0
  canvas.setAttribute('role', 'img')
  canvas.setAttribute('aria-label', 'Illustrative firewall appliance — drag to rotate')
  canvas.setAttribute('aria-describedby', 'hardware-instructions')
  let model, disposed = false, visible = false, raf = 0, lastTime = 0
  const disposeModel = object => object?.traverse(child => {
    child.geometry?.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.filter(Boolean).forEach(material => {
      Object.values(material).forEach(value => { if (value?.isTexture) value.dispose() })
      material.dispose()
    })
  })
  const render = () => { if (!disposed && model) renderer.render(scene, camera) }
  const tick = time => {
    raf = 0
    if (disposed || !visible || reduce || !model) return
    controls.update(lastTime ? Math.min((time - lastTime) / 1000, .1) : 0)
    lastTime = time
    render()
    raf = requestAnimationFrame(tick)
  }
  const resume = () => { if (!raf && visible && !reduce && model) { lastTime = 0; raf = requestAnimationFrame(tick) } }
  const resize = () => {
    const width = host.clientWidth, height = host.clientHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    render()
  }
  const keydown = event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'ArrowLeft') pivot.rotation.y -= .15
    if (event.key === 'ArrowRight') pivot.rotation.y += .15
    if (event.key === 'ArrowUp') pivot.rotation.x -= .15
    if (event.key === 'ArrowDown') pivot.rotation.x += .15
    render()
  }
  const lost = event => { event.preventDefault(); onFailure(); cleanup() }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting)
    if (visible) resume()
    else { cancelAnimationFrame(raf); raf = 0 }
  })
  const resizer = new ResizeObserver(resize)
  const abort = new AbortController()
  function cleanup() {
    if (disposed) return
    disposed = true
    abort.abort()
    cancelAnimationFrame(raf)
    observer.disconnect()
    resizer.disconnect()
    controls.removeEventListener('change', render)
    controls.dispose()
    canvas.removeEventListener('keydown', keydown)
    canvas.removeEventListener('webglcontextlost', lost)
    disposeModel(model)
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
  controls.addEventListener('change', render)
  canvas.addEventListener('keydown', keydown)
  canvas.addEventListener('webglcontextlost', lost)
  observer.observe(host)
  resizer.observe(host)
  // Fetch and validate the GLB header: SPA hosts may return HTML for a missing asset.
  // Parsing only valid binary data also keeps a failed load on the still-image path.
  fetch('media/firewall.glb', { signal: abort.signal }).then(async response => {
    if (!response.ok) throw new Error('Model unavailable')
    const data = await response.arrayBuffer()
    if (data.byteLength < 12 || new DataView(data).getUint32(0, true) !== 0x46546c67) throw new Error('Invalid GLB')
    return new GLTFLoader().parseAsync(data, new URL('media/', document.baseURI).href)
  }).then(gltf => {
    if (disposed) { disposeModel(gltf.scene); return }
    model = gltf.scene
    model.traverse(child => {   // the scan ships fully metallic; clamp it so the key light can shape the chassis
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.filter(m => m?.isMeshStandardMaterial).forEach(m => { m.metalness = Math.min(m.metalness, .4); m.roughness = Math.max(m.roughness, .45) })
    })
    const bounds = new Box3().setFromObject(model)
    const size = bounds.getSize(new Vector3())
    const scale = 2.8 / Math.max(size.x, size.y, size.z, .001)
    model.position.sub(bounds.getCenter(new Vector3()))
    pivot.add(model)
    pivot.scale.setScalar(scale)
    host.appendChild(canvas)
    resize()
    onReady()
    resume()
  }).catch(() => { if (!disposed) { onFailure(); cleanup() } })
  return cleanup
}
