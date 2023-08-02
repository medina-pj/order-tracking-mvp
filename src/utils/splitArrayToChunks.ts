/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Wednesday August 2nd 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: August 2nd 2023, 2:05:38 pm
 * ---------------------------------------------
 */

const splitArrayToChunks = ({ chunkSize = 20, data }: { chunkSize?: number; data: any[] }) => {
  const CHUNK_SIZE = chunkSize; // Set the desired chunk size for queries
  const chunkedValues = [];

  // Split the comparisonValues array into chunks of CHUNK_SIZE
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    chunkedValues.push(data.slice(i, i + CHUNK_SIZE));
  }

  return chunkedValues;
};

export default splitArrayToChunks;
