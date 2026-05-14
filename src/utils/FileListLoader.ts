export async function importFileList(fileList?: FileList | null): Promise<string> {
    if (!fileList || fileList.length < 1) {
        return Promise.resolve('');
    }
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (data) => {
            if (!data.target) {
                resolve('');
                return;
            }
            const raw = data.target.result;
            if (!raw) {
                resolve('');
                return;
            }
            resolve(raw as string);
        };
        fileReader.readAsText(fileList[0]);
    });
}
