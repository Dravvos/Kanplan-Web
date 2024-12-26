import { get, post, put, deletar } from "../services/api-handler";


async function getComment(commentId) {
   try {
      const response = await get('Comment/GetComment/' + commentId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function createComment(args) {
   try {
      const resposta = await post('Comment', args);
      return resposta
   } catch (error) {
      console.error(error)
   }
}

async function updateComment(id, args) {
   try {
      const resposta = await put('Comment/' + id, args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function deleteComment(id) {
   try {
      const resposta = await deletar('Comment/' + id);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}


export { getComment, createComment, updateComment, deleteComment }