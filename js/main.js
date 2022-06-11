// ページの読み込みを待つ
window.addEventListener("load", init);

// canvasのサイズを指定
const width = window.innerWidth; //ウインドウの横の長さ
const height = 400; //エリアの縦の長さ

function init() {
  // シーンを作る
  const scene = new THREE.Scene();

  // カメラを作る
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 1000); // x,y,z座標でカメラの場所を指定

  // レンダラーを作る
  const canvasElement = document.querySelector("#canvas"); //HTMLのcanvasのid
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true, //背景を透明にする
    antialias: true, //アンチエイリアス
  });
  renderer.setSize(width, height); //サイズ

  // ライトを作る
  const light = new THREE.AmbientLight(0xffffff, 1); //環境光源（色、光の強さ）
  scene.add(light);

  // 画像
  const loader = new THREE.TextureLoader();
  const texture01 = loader.load("./img/img_01.jpg");
  const texture02 = loader.load("./img/img_02.jpg");
  const texture03 = loader.load("./img/img_03.jpg");

  const textures = [texture01, texture02, texture03];

  // 3Dオブジェクトを作る
  const geometry = new THREE.DodecahedronGeometry(300, 0); // DodecahedronGeometry 正十二面体（半径、詳細）

  // 枠線を作成
  const line = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry), // 線
    new THREE.LineBasicMaterial({
      color: 0x000000, // 線の色
    })
  );

  const material = new THREE.MeshPhongMaterial({
    map: texture01,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.add(line);
  scene.add(mesh);

  // マウス
  let mouseX = 0,
    mouseY = 0; // マウス座標

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = 200;

  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }
  document.addEventListener("mousemove", onDocumentMouseMove);

  // アニメ―ション
  function start() {
    requestAnimationFrame(start);

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    // 原点方向を見つめる
    camera.lookAt(scene.position);

    //球体が回転する
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.005;

    // レンダリング
    renderer.render(scene, camera);
  }
  start();

  // ウインドウのリサイズ対応
  onWindowResize();
  window.addEventListener("resize", onWindowResize);

  function onWindowResize() {
    // ウインドウ幅を取得
    const width = window.innerWidth;
    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, 400);

    windowHalfX = window.innerWidth / 2;
    windowHalfY = 200;

    // カメラのアスペクト比を正す
    camera.aspect = width / 400;
    camera.updateProjectionMatrix();
  }

  // KV背景の画像切り替え
  const backgrounds = [
    "../img/img_01.jpg",
    "../img/img_02.jpg",
    "../img/img_03.jpg",
  ];
  const kvElement = document.querySelector(".kv-block"); //HTMLののid

  document.querySelector("#arrow-left").addEventListener("click", bgLeftChange);
  let count = 0;

  function bgLeftChange() {
    count--;
    if (count == -1) count = backgrounds.length - 1;
    kvElement.style.backgroundImage = "url(" + backgrounds[count] + ")";
    material.map = textures[count];
    setTimeout(function () {
      setTimeout(function () {
        kvElement.classList.remove("fadeInBg");
      }, 2000),
        kvElement.classList.add("fadeInBg");
    }, 4000);
  }

  document
    .querySelector("#arrow-right")
    .addEventListener("click", bgRightChange);

  function bgRightChange() {
    count++;
    if (count == backgrounds.length) count = 0;
    kvElement.style.backgroundImage = "url(" + backgrounds[count] + ")";
    material.map = textures[count];
    setTimeout(function () {
      setTimeout(function () {
        kvElement.classList.remove("fadeInBg");
      }, 2000),
        kvElement.classList.add("fadeInBg");
    }, 4000);
  }
}
