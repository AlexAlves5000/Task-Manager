const soma = (a, b) => {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Os números devem ser positivos!')
            }
            resolve(a + b)
        }, 2000);

    })
}

const doWork = async () => {
    const total = await soma(10, 10)
    const total1 = await soma(total, 20)
    const total2 = await soma(total1, 30)
    return total2
}

doWork().then((result) => {
    console.log('Resultado: ', result)
}).catch((e) => {
    console.log('Erro: ', e)
})