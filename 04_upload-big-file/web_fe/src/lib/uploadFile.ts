import { sliceFile } from './sliceFile';

export async function uploadFile(
  file: File,
  chunkMegaSize: number,
  uploadURL: string,
  verifyURL: string,
  mergeURL: string,
  processCallback: () => void
) {
  const { chunkList, hash } = await sliceFile(file, chunkMegaSize);
  let allChunkList = chunkList;
  let neededChunkList = [];
  let progress = 0;
  let extname = file.name.split('.').pop();
  if (verifyURL) {
    const data = await fetch(verifyURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hash,
        totalCount: allChunkList.length,
        extname,
      }),
    });
    console.log(data);
    if (data.message) console.log(data.message);
    if (!data.neededFileList.length) {
      processCallback(100);
      return;
    }

    neededChunkList = data.neededFileList;
  }

  progress =
    ((allChunkList.length - neededChunkList.length) / allChunkList.length) *
    100;

  if (allChunkList.length) {
    const requestList = allChunkList.map(async (chunk, index) => {
      if (neededChunkList.includes(index + 1)) {
        const response = await uploadChunk(chunk, index + 1, hash, uploadURL);
        //更新进度
        progress += Math.ceil(100 / allChunkList.length);
        if (progress >= 100) progress = 100;
        processCallback(progress);
        return response;
      }
    });
    Promise.all(requestList).then(() => {
      //发送请求，通知后端进行合并 //后缀名可通过其他方式获取，这里以.mp4为例
      fetch(mergeURL, {
        method: 'POST',
        body: JSON.stringify({ file, extname }),
      });
    });
  }
}

async function uploadChunk(
  chunk: ArrayBuffer,
  index: number,
  fileHash: string,
  uploadURL: string
) {
  let formData = new FormData();
  //注意这里chunk在之前切片之后未ArrayBuffer，而formData接收的数据类型为 blob|string
  formData.append('chunk', new Blob([chunk]));
  formData.append('index', String(index));
  formData.append('fileHash', fileHash);
  return fetch(uploadURL, {
    method: 'POST',
    body: formData,
  });
}
