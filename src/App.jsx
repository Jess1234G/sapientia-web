// src/App.jsx
import { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [html3D, setHtml3D] = useState('');

  // Función para iniciar sesión con Google
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  // Manejar la selección de imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Enviar la petición al backend
  const sendRequest = async () => {
    if (!image) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    setLoading(true);
    setResponse(null);
    setHtml3D('');

    const formData = new FormData();
    formData.append('mensaje', message);
    formData.append('archivo', image);
    formData.append('generar_grafico', 'true');
    formData.append('usuario_id', user?.email || 'test');

    try {
      // Obtenemos el token del usuario logueado
      const idToken = await user?.getIdToken();

      // ⚠️ AQUÍ ESTÁ TU IP LOCAL (según tu captura de Firebase)
      const url = 'https://sapientia-backend-production.up.railway.app/preguntar-vision';

      const res = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mostramos la respuesta de texto
      setResponse(res.data.respuesta);

      // Si hay gráfico 3D, lo decodificamos y lo mostramos
      if (res.data.grafico_3d_html_base64) {
        const htmlDecoded = atob(res.data.grafico_3d_html_base64);
        setHtml3D(htmlDecoded);
      }

    } catch (error) {
      console.error(error);
      setResponse(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {!user ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Sapientia</h1>
          <p>Inicia sesión para comenzar</p>
          <button 
            onClick={login}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Iniciar sesión con Google
          </button>
        </div>
      ) : (
        <>
          <h2>Sapientia - Tutor IA</h2>
          <p>Bienvenido, {user.displayName || user.email}</p>
          
          <div style={{ marginTop: '20px' }}>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Escribe tu pregunta sobre el ejercicio..."
              rows="3"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <input 
              type="file" 
              onChange={handleImageChange} 
              accept="image/*" 
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={sendRequest} 
              disabled={loading}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              {loading ? 'Procesando...' : 'Enviar a Sapientia'}
            </button>
          </div>

          {response && (
            <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
              <h3>Respuesta:</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{response}</p>
            </div>
          )}

          {html3D && (
            <div style={{ marginTop: '30px' }}>
              <h3>Gráfico 3D interactivo:</h3>
              <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                <iframe 
                  srcDoc={html3D} 
                  style={{ width: '100%', height: '100%', border: 'none' }} 
                  title="Gráfico 3D Sapientia"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;