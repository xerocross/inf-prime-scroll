import InfPrimeScroll from "./components/prime-number-scroll.vue";
import Vue from "vue";

new Vue({
    el : "#prime-number-scroll",
    components : {
        InfPrimeScroll
    },

    render : function (createElement) {
        return createElement(InfPrimeScroll, {
            props : {
                primeWorkerUrl : "more-primes-worker.js",
                busyImageUrl : "/busy3.gif"
            }  
        });
    }
});