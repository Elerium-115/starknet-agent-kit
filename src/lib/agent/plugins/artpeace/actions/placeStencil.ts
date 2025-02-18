import { promises as fs } from 'fs';
import { placePixelParam, placeStencilParam } from '../schema';
import { placePixel, placePixelSignature } from './placePixel';
import { getFilename } from '../utils/getFilename';

export const placeStencil = async (param: placeStencilParam) => {
  try {
    const startPos: { x: number; y: number } = { x: param.xPos, y: param.yPos };
    const canvasId = param.canvasId;

    const filename = param.filename;
    if (!filename) {
      throw new Error('No filename found.');
    }
    const fullName = await getFilename(filename);

    let buffer;
    try {
      buffer = await fs.readFile(fullName);
    } catch (error) {
      throw new Error(error.message);
    }

    const formData = new FormData();
    const file = new File([buffer], filename);
    formData.append('image', file);
    const response = await fetch(`https://api.art-peace.net/add-stencil-img`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const imgHash = json.result;

    const response2 = await fetch(
      `https://api.art-peace.net/get-stencil-pixel-data?hash=${imgHash}`
    );
    if (!response2.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const response2Data = await response2.json();

    const pixelsColorIds: number[] = response2Data.data.pixelData;
    const stencilWidth: number = response2Data.data.width;

    let pos = { x: startPos.x - 1, y: startPos.y };
    const allData: placePixelParam[] = pixelsColorIds.map((pixelId) => {
      if (pos.x === startPos.x + stencilWidth - 1)
        pos = { x: startPos.x, y: pos.y + 1 };
      else pos = { x: pos.x + 1, y: pos.y };
      const color: string = pixelId.toString();
      return { canvasId, xPos: pos.x, yPos: pos.y, color };
    });

    return await placePixelSignature({ params: allData });
  } catch (error) {
    return JSON.stringify({
      status: 'error',
      error: {
        code: 'PLACE_STENCIL_ERROR',
        message: error.message || 'Failed to generate place_pixel call data',
      },
    });
  }
};
