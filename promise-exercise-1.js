console.log("Program Started")

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise Resolved !")
    }, 3000)
})

const resolvePromise = (result) => {
    console.log(result)
}

promise.then(resolvePromise)
console.log(promise)
console.log("Program complete")
