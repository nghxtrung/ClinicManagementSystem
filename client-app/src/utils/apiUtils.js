export function handleApi(apiFunc, setLoading = null) {
    return new Promise(async (resolve, reject) => {
        if (setLoading !== null) {
            setLoading(true);
        }
        await apiFunc()
            .then(response => {
                response = response.data;
                if (response.isSuccess)
                    resolve(response.data);
                else
                    reject(response.message);
            }).catch(error => {
                reject(error.message);
            }).finally(() => {
                if (setLoading !== null) {
                    setLoading(false);
                }
            });
    });
}