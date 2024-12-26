import { get, post, put, deletar } from "../services/api-handler";

async function getAttach(attachId) {
   try {
      const response = await get('Attach/GetAttach/' + attachId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function createAttach(args) {
   try {
      const resposta = await post('Attach', args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function updateAttach(id, args) {
   try {
      const resposta = await put('Attach/' + id, args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function deleteAttach(id) {
   try {
      const resposta = await deletar('Attach/' + id);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}


export { getAttach, createAttach, updateAttach, deleteAttach }