const aritifical_setinterval = () => {
        setTimeout(function run() {
        console.log("hello");
        aritifical_setinterval();
    }, 1000)
}

aritifical_setinterval()