// Url sin end Point
import { API_URL } from '../../../../utils/httpRequest';


import axios from 'axios'
import { TOKEN } from '../../../../utils/httpRequest';

const endpoint = 'jornada';

let alertShow = false;


// GET
export const fetchData = async ()=>{

  if (!TOKEN){
    window.location.href = '/'

    return null
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  }
  try{
    const response = await axios.get(`${API_URL}/${endpoint}/`, {headers})
    return response.data
  }catch (error){

    if (error.response && error.response.status === 401) {
      if (!alertShow) {
        // Aquí podrías intentar renovar el token o redirigir al usuario a la página de inicio de sesión
        // Si tu backend admite la renovación de tokens, podrías implementar esa lógica aquí
        alert('La sesión ha caducado. Serás redirigido al inicio de sesión.');
        alertShow = true; // Marcar que la alerta ha sido mostrada
        window.location.href = '/'; // Ajusta la URL según tu estructura de rutas
      }
      return null;
    }

    console.error("erro en el fetch", error)
    throw error;
  }
}


// Metodo PUT 
export const actualizarJornada = async (id, jornadaData, handleClose) => {
  if (!TOKEN) {
    window.location.href = '/';
    return null;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  };

  try {
    // Validación de campos
    if (!jornadaData.nombreJornada) {
      throw new Error("Nombre requerido");
    }
    if (!jornadaData.diaIniJor) {
      throw new Error("Dia inicio requerido");
    }
    if (jornadaData.diaFinJor) {
      throw new Error("Dia fin requerido");
    }
    if (!jornadaData.estadoJornada) {
      throw new Error("Estado requerido");
    }

    // Realizar la solicitud PUT
    await axios.put(`${API_URL}/${endpoint}/${id}`, jornadaData, { headers });

    // Cierre del modal u otra acción después de la actualización
    handleClose();

  } catch (error) {
    console.error("JORNADA_PATCH", error);

    // Manejo específico de errores
    if (error.response && error.response.status === 400) {
      // Errores de validación del servidor
      return new Error(error.response.data.message || "Error de validación");
    } else if (error.response && error.response.status === 500) {
      // Otros errores del servidor
      return new Error("Error interno del servidor");
    } else {
      // Otros errores
      return new Error("Error desconocido");
    }
  }
};

  
//   Metodo POST 
export const registrarJornada = async (jornadaData) => {
  if (!TOKEN){
    window.location.href = '/'
    return null
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  }

  try {
    // Validación de campos
    if (!jornadaData.nombreJornada) {
      throw new Error("Nombre requerido");     
    }
    if (!jornadaData.diaIniJor) {
      throw new Error("Dia inicio requerido");
    }
    if (!jornadaData.diaFinJor) {
      throw new Error("Dia fin requerido");
    }
    if (!jornadaData.estadoJornada) {
      throw new Error("Estado. requerido");
    }
    await axios.post(`${API_URL}/${endpoint}/`,
      jornadaData,
      {headers}
    );
    window.location.reload(); // Recarga la página
  } catch (error) {
    console.error("REGISTER_PATCH", error);

    if (error.response && error.response.status === 400) {
      // Manejar errores de validación del servidor
      console.error("Error de validación del servidor:", error.response.data);
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      console.error("Error de red:", error.message);
    } else {
      // Otros errores
      console.error("Error desconocido:", error.message);
    }
    throw new Error("Error al registrar el instructor");
  }
};

// Metodo DELETE 
export const eliminarJornada = async (id) => {
  if (!TOKEN) {
    window.location.href = '/?error=no_token';
    return Promise.reject(new Error('No hay token disponible.'));
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  };

  try {
    await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers });
    console.log(`Instructor con ID ${id} eliminado correctamente`);
  } catch (error) {
    console.error(`Error al eliminar el instructor con ID ${id}`, error);
    throw new Error(`Error al eliminar el instructor: ${error.message}`);
  }
};
