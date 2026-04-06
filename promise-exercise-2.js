console.log("Program Started")

const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve()
    }, 3000)
})

const promise2 = new Promise((resolve, reject) => {
    resolve("Step 2 complete")
})

console.log(promise1)
console.log("Program in progress...")

promise1.then(() => {
    console.log("Step 1 complete")
    return promise2
}).then((result) => {
    setTimeout(() => {console.log(result)}, 3000)
})
