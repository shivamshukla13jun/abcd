
 const createRegex = (value: string) => new RegExp(`.*${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`, "gi");
 const parseJSON=(value: string | undefined)=>{
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return undefined;
    }
}

function generateNumber(length: number = 4): number {
    if (length !== 4) {
        throw new Error('Required 4 length');
    }
    return Math.floor(1000 + Math.random() * 9000);
}
const convertToArray = (field: any) => typeof field === 'string' ? field.split(',').filter(Boolean) : field;
export {createRegex,parseJSON,generateNumber,convertToArray}