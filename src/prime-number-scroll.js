import PrimeNumberScroll from "./components/prime-number-scroll.vue";
import Vue from "vue";

new Vue({
    el : "#prime-number-scroll",
    components : {
        PrimeNumberScroll
    },

    render : function (createElement) {
        return createElement(PrimeNumberScroll, {
            props : {
                primeWorkerUrl : "more-primes-worker.js",
                busyImageUrl : "/busy3.gif"
            }  
        });
    }
});