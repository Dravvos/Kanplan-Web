import { get, post, put, deletar } from "../services/api-handler";


async function getBucket(bucketId) {
   try {
      const response = await get('Bucket/GetBucket/' + bucketId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function getBuckets(projectId) {
   try {
      const response = await get('Bucket/' + projectId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function createBucket(args) {
   try {
      const resposta = await post('Bucket', args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function updateBucket(id, args) {
   try {
      const resposta = await put('Bucket/' + id, args);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}

async function deleteBucket(id) {
   try {
      const resposta = await deletar('Bucket/' + id);
      return resposta;
   } catch (error) {
      console.error(error)
   }
}


export { getBucket, getBuckets, createBucket, updateBucket, deleteBucket }