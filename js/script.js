window.onload = function()
{
    var camera, scene, renderer;
    var effect, controls;
    var element, container, mercurio;
    var clock = new THREE.Clock();
    var cube, veCubo = false; //VARIABLES DE EJEMPLO, NO DEBERÁ ESTAR AL FINAL...
    //Array de planetas y sus posiciones en el escenario..
    //Posciones elementos...
    /*
    Atrás: x : -300, y : 350, z : 30,
    Adelante : x : 250, y : 350, z : 0
    Izquierda : x : 0, y : 200, z : -350
    Derecha : x : 0, y : 180, z : 300
    */
    //Base array planetas...
    var planetas = [
					 {
						 imagen 	 : "jupiter.jpg",
                         nombre      : "Planeta jupiter",
                         vista       : false,
                         position    : {x : 0, y : 200, z : -350},
						 objeto		 : 0
					 },
           {
             imagen 	 : "luna.jpg",
                         nombre      : "La luna",
                         vista       : false,
                         position    : {x : -300, y : 350, z : 30},
						 objeto		 : 1

           },
           {
             imagen 	 : "marte.jpg",
                         nombre      : "Planeta marte",
                         vista       : false,
                         position    : {x : 0, y : 380, z : 300},
						 objeto		 : 2

           },
           {
             imagen 	 : "venus.jpg",
                         nombre      : "Planeta venus",
                         vista       : false,
                         position    : {x :250, y : 300, z : 0},
						 objeto		 : 3

           },
            ];
    var crearPlaneta = function(data)
	{
		var geometria = new THREE.SphereGeometry(50,50,50);
		var textura = THREE.ImageUtils.loadTexture(data);
		var material = new THREE.MeshBasicMaterial( { map: textura } );
		return new THREE.Mesh(geometria, material);
    planetas = new THREE.Mesh(geometry, material);
	};

    var resize = function()
    {
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        effect.setSize(width, height);
    };

    var init = (function()
    {
        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('example');
        container.appendChild(element);
        effect = new THREE.StereoEffect(renderer);
        effect.separation = 0.2;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
        camera.position.set(0, 5, 0);
        scene.add(camera);
        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set
        (
            camera.position.x + 0.1,
            camera.position.y + 0.1,
            camera.position.z
        );
        controls.noZoom = false;
        controls.noPan = false;
        //controls.autoRotate = true;
        function setOrientationControls(e)
        {
            if (!e.alpha)
            {
                return;
            }
            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        //Adicona luz..
        window.addEventListener('deviceorientation', setOrientationControls, true);
        var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
        scene.add(light);

        //Crear los planetas...
        //Con la porpiedad position.x se establecerá la posición en x, los mismo con y, z
        //ES ESTE ESPACIO SE ESPERA QUE SE CREEN LOS "PLANTEAS/LUNA"
        // SE PUEDE HACER USO DE LA FUNCIÓN crearPlaneta()
        //EL TAMAÑO DE LOS PLANETAS PUEDE SER IGUAL A 50
        //LAS IMÁGENES SE ENCUENTRA DENTRO DE LA CARPETA img/planteas
        for(var i=0; i<planetas.length;i++)
        {
          planetas[i].objeto = crearPlaneta("img/planetas/" + planetas[i].imagen);
          scene.add(planetas[i].objeto);
          planetas[i].objeto.position.x = planetas[i].position.x ;
          planetas[i].objeto.position.y = planetas[i].position.y ;
          planetas[i].objeto.position.z = planetas[i].position.z;
        }

        /*
        EJEMPLO CON UN CUBO...
        ESTA PORICIÓN DE CÓDIGO SÓLO TIENE FINES DE EJEMPLO, NO DEBEÁ ESTAR AL FINAL DEL EJERCICIO...
        */
/*
        var geometry = new THREE.SphereGeometry(20,20,20);
        var material = new THREE.MeshBasicMaterial({color: "red"});
        var texture = THREE.ImageUtils.loadTexture('img/planetas/luna.jpg');
        var material = new THREE.MeshBasicMaterial({map: texture});
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = -200;
        cube.position.y = 200;
        cube.position.z = 30;
*/
        //FIN DEL EJEMPLO, NO DEBERÁ ESTAR AL FINAL...


        //http://stemkoski.github.io/Three.js/Skybox.html
        //Para adicionar escenario en 3D...
        var imagePrefix = "img/place/place-";
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".jpg";
        var skyGeometry = new THREE.BoxGeometry( 800, 800, 800 );

        var materialArray = [];
        for (var i = 0; i < 6; i++)
        {
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));
        }
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
        window.addEventListener('resize', resize, false);
        setTimeout(resize, 1);
    })();

    var update = function(dt)
    {
        resize();
        camera.updateProjectionMatrix();
        controls.update(dt);
    };
    //Saber si el elemento está dentro del punto de vista que se está viendo...
    var puntoDeVista = function()
	{
        var frustum = new THREE.Frustum();
        var cameraViewProjectionMatrix = new THREE.Matrix4();
        camera.updateMatrixWorld(); // make sure the camera matrix is updated
        camera.matrixWorldInverse.getInverse( camera.matrixWorld );
        cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromMatrix( cameraViewProjectionMatrix );
        //frustum.intersectsObject(objeto) indica si está el punto de vísta...
        //ESTO LO HARÁ POR CADA FRAME, POR LO QUE ES IMPORTANTE VALIDAR SI YA ESTÁ VIENDO EL OBJETO...
        //EN EL EJEMPLO DEL ARRAY DE PLANETAS, EXISTE LA PROPIEDAD "vista", la cual indica si se está viendo el planeta...
        //EJEMPLO VIENDO UN CUBO...

/*
        if(frustum.intersectsObject(cube))
        {
            if(!veCubo)
            {
                veCubo = true;
                responsiveVoice.speak("Estas viendo un cubo, es tenporal, por favor borrarlo al final", "Spanish Female");
            }
        }
        else
        {
            veCubo = false;
        }
        */
        for (var i = 0; i < planetas.length; i++) 
        {
            if(frustum.intersectsObject(planetas[i].objeto))
            {
                if(!planetas[i].vista)
                {
                    planetas[i].vista = true;
                    //responsiveVoice.speak("Estas viendo planetas, es tenporal, por favor borrarlo al final", "Spanish Female");
                    console.log("estas viendo"+ planetas[i].nombre);
                }
            }
            else
            {
                planetas[i].vista = false;
            }
        }
  	
    };  



    var animate = function()
    {
        requestAnimationFrame(animate);
        //ESPACIO DONDE SE ESPERA QUE LOS PLANETAS/LUNA GIREN EN Y
        //SE PUEDE HACER USO DE LA PROPIEDAD rotation
        //cube.rotation.y += 0.1; //EJEMPLO, NO DEBERÁ ESTAR AL FINAL DEL EJERCICIO...
       // planetas.rotation.y += 0.1;
       for(var i=0; i<planetas.length;i++)
        {
            planetas[i].objeto.rotation.y +=0.01;
        }
        puntoDeVista();
        update(clock.getDelta());
        effect.render(scene, camera);
    };
    animate();

    var fullscreen = function()
    {
        if (container.requestFullscreen)
        {
            container.requestFullscreen();
        }
        else if (container.msRequestFullscreen)
        {
            container.msRequestFullscreen();
        }
        else if (container.mozRequestFullScreen)
        {
            container.mozRequestFullScreen();
        }
        else if (container.webkitRequestFullscreen)
        {
            container.webkitRequestFullscreen();
        }
    }
};
