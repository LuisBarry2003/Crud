import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, onSnapshot, query, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJGb4w83EXF3wntzHJqay_Eyj2ddmpKyU",
  authDomain: "saua-7b912.firebaseapp.com",
  projectId: "saua-7b912",
  storageBucket: "saua-7b912.appspot.com",
  messagingSenderId: "621882664222",
  appId: "1:621882664222:web:f532c916366f31baf4950f",
  measurementId: "G-FNYCSQVQFW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const bti = document.getElementById("inser");
  const btc = document.getElementById("consu");
  const bte = document.getElementById("Edit");
  const btel = document.getElementById("Elim");
  const btClear = document.getElementById("limpiar");
  const tablaUsuarios = document.querySelector("#tbUsuarios");

  if (bti) {
    bti.addEventListener('click', async () => {
      const nom = document.getElementById("nombre");
      const ap = document.getElementById("ap").value;
      const cel = document.getElementById("cel").value;
      const grupo = document.getElementById("grupo").value;
      const programa = document.getElementById("programa").value;
      const unidad = document.getElementById("unidad").value;

      if (nom.value && ap && cel && grupo && programa && unidad) {
        const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
        const autoCorreo = `${randomId}@uagro.mx`;

        try {
          await setDoc(doc(db, "usuarios", randomId), {
            nombre: nom.value,
            ap: ap,
            correo: autoCorreo,
            tel: cel,
            grupo: grupo,
            programa: programa,
            unidad: unidad,
          });
          console.log("Documento Insertado con ID: ", randomId);
        } catch (e) {
          console.error("Error al Añadir el Documento: ", e);
        }
      } else {
        console.error("Por favor, completa todos los campos.");
      }
    });
  }

  if (btc) {
    btc.addEventListener('click', () => {
      ShowUsers();
    });
  }

  if (btClear) {
    btClear.addEventListener('click', () => {
      document.getElementById("userId").value = '';
      document.getElementById("nombre").value = '';
      document.getElementById("ap").value = '';
      document.getElementById("correo").value = '';
      document.getElementById("cel").value = '';
      document.getElementById("grupo").value = '';
      document.getElementById("programa").value = '';
      document.getElementById("unidad").value = '';
    });
  }

  async function ShowUsers() {
    const q = query(collection(db, "usuarios"));
    onSnapshot(q, (querySnapshot) => {
      tablaUsuarios.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const datos = doc.data();
        tablaUsuarios.innerHTML += `<tr>
        <td>${doc.id}</td>
        <td>${datos.nombre}</td>
        <td>${datos.ap}</td>
        <td>${datos.correo}</td>
        <td>${datos.tel}</td>
        <td>${datos.grupo}</td>
        <td>${datos.programa}</td>
        <td>${datos.unidad}</td>
        <td>
            <button class="btn-primary btn m-1 editar_" data-id="${doc.id}">
            <i class="bi bi-pencil-square"></i> Editar 
            <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
            </button> 
            <button class="btn-danger btn eliminar_" data-id="${doc.id}|${datos.nombre}">
            <i class="bi bi-trash"></i> Eliminar 
            <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
            </button>
        </td>
      </tr>`;
      });
    });
  }

  tablaUsuarios.addEventListener('click', async (e) => {
    if (e.target.closest('.editar_')) {
      const userId = e.target.closest('.editar_').dataset.id;

      const userDoc = await getDoc(doc(db, "usuarios", userId));
      const userData = userDoc.data();

      document.getElementById("userId").value = userId;
      document.getElementById("nombre").value = userData.nombre;
      document.getElementById("ap").value = userData.ap;
      document.getElementById("correo").value = userData.correo;
      document.getElementById("cel").value = userData.tel;
      document.getElementById("grupo").value = userData.grupo;
      document.getElementById("programa").value = userData.programa;
      document.getElementById("unidad").value = userData.unidad;
    }

    if (e.target.closest('.eliminar_')) {
      const userId = e.target.closest('.eliminar_').dataset.id.split('|')[0];

      try {
        await deleteDoc(doc(db, "usuarios", userId));
        console.log("Documento Eliminado con ID: ", userId);
      } catch (error) {
        console.error("Error al Eliminar Documento: ", error);
      }
    }
  });

  if (bte) {
    bte.addEventListener('click', async () => {
      const userId = document.getElementById("userId").value;
      const nom = document.getElementById("nombre").value;
      const ap = document.getElementById("ap").value;
      const correo = document.getElementById("correo").value;
      const cel = document.getElementById("cel").value;
      const grupo = document.getElementById("grupo").value;
      const programa = document.getElementById("programa").value;
      const unidad = document.getElementById("unidad").value;

      if (userId && nom && ap && correo && cel && grupo && programa && unidad) {
        try {
          const userRef = doc(db, "usuarios", userId);
          await updateDoc(userRef, {
            nombre: nom,
            ap: ap,
            correo: correo,
            tel: cel,
            grupo: grupo,
            programa: programa,
            unidad: unidad,
          });
          console.log("Documento Actualizado con el ID: ", userId);
        } catch (e) {
          console.error("Error al Actualizar el documento: ", e);
        }
      } else {
        console.error("Por favor, completa todos los campos.");
      }
    });
  }

  if (btel) {
    btel.addEventListener('click', async () => {
      const userId = document.getElementById("userId").value;

      try {
        await deleteDoc(doc(db, "usuarios", userId));
        console.log("Documento Eliminado con el ID: ", userId);
      } catch (e) {
        console.error("Error al eliminar Documento: ", e);
      }
    });
  }

  ShowUsers();
});
