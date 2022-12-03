const ipcRenderer = window.require('electron').ipcRenderer;
const canvas = document.querySelector('canvas');
// Creamos el escenario
const scene = new THREE.Scene();

// Creamos la cámara
const camera = new THREE.PerspectiveCamera(
  75, // Ángulo de visión
  window.innerWidth / window.innerHeight, // Relación de aspecto
  0.1, // Distancia mínima
  1000 // Distancia máxima
);
camera.position.z = 5; // La movemos un poco hacia atrás para poder ver el objeto

// Creamos el renderer
const renderer = new THREE.WebGLRenderer({canvas});
// Creamos una instancia de la clase Raycaster
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 5);
scene.add(light);
const raycaster = new THREE.Raycaster();
renderer.setClearColor(0xFFFFFF); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creamos el cuadrado
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({
  color: 0xff0000
});


let objModel = new THREE.Mesh(geometry, material);
scene.add(objModel);

ipcRenderer.on('file-path', (event, filePath) => {
    console.log(filePath);
    new THREE.OBJLoader().load(filePath, (object) => {
        // Asigna el modelo a la variable creada anteriormente
        scene.remove(objModel);
        object.traverse((child) => {
            // Si el hijo es una malla, establecemos el material en esta
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
          });
        objModel = object;
        scene.add(objModel);
    });
});

ipcRenderer.on('stop-animation', (event) => {
    isStopped = !isStopped;
})

// Añadimos la capacidad de arrastrar el ratón para mover y girar el objeto
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};
const onMouseDown = (event) => {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
};
const onMouseUp = (event) => {
  isDragging = false;
};
const onMouseMove = (event) => {
  if (isDragging) {

    const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
    console.log(elementUnderMouse);
    if (elementUnderMouse !== canvas) {
      return;
    }

    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    if (event.buttons === 1) {
      // Giramos el objeto
      objModel.rotation.x += deltaMove.y * 0.01;
      objModel.rotation.y += deltaMove.x * 0.01;
    } else if (event.buttons === 2) {
      // Movemos el objeto
      objModel.position.x += deltaMove.x * 0.01;
      objModel.position.y -= deltaMove.y * 0.01;
    }

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
};
// Añadimos los manejadores de eventos del ratón
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

let isStopped = false;
// Creamos el bucle de animación
const animate = () => {
  // Si la animación no está detenida, rotamos el cubo
  if (!isStopped) {
    objModel.rotation.x += 0.01;
    objModel.rotation.y += 0.01;
  }

  // Renderizamos la escena
  renderer.render(scene, camera);

  // Volvemos a llamar a la función animate en el siguiente frame
  requestAnimationFrame(animate);
};



// Agregamos un manejador de eventos que se ejecute cuando se gire la rueda del ratón
canvas.addEventListener('wheel', (event) => {
  // Si se gira la rueda hacia adelante (scroll up), aumentamos la posición en Z de la cámara
  if (event.deltaY < 0) {
    camera.position.z += 0.1;
  }
  // Si se gira la rueda hacia atrás (scroll down), disminuimos la posición en Z de la cámara
  if (event.deltaY > 0) {
    camera.position.z -= 0.1;
  }
  // Rendereamos la escena de nuevo con la nueva posición de la cámara
  renderer.render(scene, camera);
});


// Agregamos un manejador de eventos que se ejecute cuando se mueva el ratón en el canvas
canvas.addEventListener('mousemove', (event) => {
  // Establecemos la posición del ratón en el canvas
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Determinamos si el ratón está cerca del cubo
  const intersects = raycaster.intersectObjects([objModel]);
  if (intersects.length > 0) {
    // Si el ratón está cerca del cubo, recorremos la lista de vértices y resaltamos los vértices que se encuentren cerca del ratón
    intersects.forEach((intersect) => {
      intersect.face.color.setHex(0x00ff00);
    });
  }
});


// Iniciamos el bucle de animación
animate();


