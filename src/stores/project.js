import { get, post, put, deletar } from "../services/api-handler";


async function getProject(projectId) {
   try {
      const response = await get('Project/GetProject/' + projectId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function getUsers(projectId) {
   try {
      const response = await get('Project/GetUsersByProject/' + projectId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function createProject(args) {
   try {
      const resposta = await post('Project', args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function updateProject(id, args) {
   try {
      const resposta = await put('Project/' + id, args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function deleteProject(id) {
   try {
      const resposta = await deletar('Project/' + id);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function assignUserToProject(userId, projectId) {
   try {
      const resposta = await post('Project/RelateUserToProject?userId=' + userId + "&projectId=" + projectId);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

export { getProject, getUsers, createProject, updateProject, deleteProject, assignUserToProject }

//Short URL Token 18e12f3f0c7981b124ca7de9a2a5e03600226496