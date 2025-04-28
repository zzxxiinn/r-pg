import SparkMD5 from 'spark-md5';

type SliceFileChunk = {
  chunkList: ArrayBuffer[];
  hash: string;
};

export async function sliceFile(file: File, chunkMegaSize: number = 1) {
  return new Promise<SliceFileChunk>((resolve, reject) => {
    // if (!(inputFile instanceof File)) {
    //   reject(`error arg type, expected File, got ${Object.prototype.toString.call(inputFile)}`)
    // }
    let chunkSize = chunkMegaSize * 1024 * 1024,
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      chunkList = [],
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader(),
      hash = null;

    const loadNext = () => {
      const start = chunkSize * currentChunk;
      const end = Math.min(start + chunkSize, file.size);
      fileReader.readAsArrayBuffer(file.slice(start, end));
    };

    fileReader.onload = (e) => {
      const chunk = e.target?.result as ArrayBuffer;
      spark.append(chunk);
      chunkList.push(chunk);
      currentChunk++;

      if (currentChunk >= chunks) {
        hash = spark.end();
        resolve({ chunkList, hash });
      } else {
        loadNext();
      }
    };

    fileReader.onerror = (e) => {
      console.error(e);
      reject(null);
    };

    loadNext();
  });
}
