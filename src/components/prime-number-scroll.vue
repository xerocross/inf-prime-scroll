<template>
    <div class="prime-numbers">
        <p>
            This is a list of prime numbers being generated right now
            on your computer.  There is no logical or pre-set upper 
            limit on the computation.  The only limits are practical.
            It depends on your computer's speed and memory, and the 
            maximum integer size your browser will allow.
        </p>
        <div 
            ref="primeList" 
            class="prime-list">
            <ul class="list-group">
                <li 
                    v-for = "(p, index) in primes"
                    :key = "p" 
                    class = "list-group-item prime-item">
                    (#{{ index+1 }})&nbsp;&nbsp;&nbsp;{{ p }}
                </li>
                <li 
                    
                    class="busy list-group-item">
                    <p><img 
                        v-show = "working"
                        :src = "busyImageUrl" 
                        height = "40" 
                        width = "40" /></p>
                </li>
            </ul>
        </div>
        <div class="btn-group">
            <a 
                ref = "download" 
                class="btn btn-default" 
            >Download List</a>
        </div>
    </div>
</template>
<script>
import SimpleHashSet from "../helpers/simple-string-set.js";
import PrepareFileHelper from "../helpers/prepare-file-helper.js";

export default {
    components : {
    },
    props : {
        primeWorkerUrl : {
            type : String,
            default : ""
        },
        busyImageUrl : {
            type : String,
            default : ""
        }
    },
    data () {
        return {
            primes : [],
            currentMaxInteger : 2,
            compositeSet : null,
            primeSet : null,
            moreToAddEachTime : 200,
            working : false,
            morePrimesWorker : null
        }
    },
    mounted () {
        this.compositeSet = SimpleHashSet.build(509063);
        let self  = this;
        this.morePrimesWorker = new Worker(this.primeWorkerUrl);
        this.morePrimes();
        var element = this.$refs.primeList;
        window.t = this;
        element.onscroll = function(ev) {
            let test = (element.scrollHeight - element.scrollTop) - 20 <= element.clientHeight;
            if (test)
            {
                self.working = true;
                setTimeout(function(){
                    self.morePrimes();
                },0);
            }
        }
    },
    methods : {
        morePrimes () {
            let self = this;
            this.working = true;
            let data = {
                currentMaxInteger : this.currentMaxInteger,
                numNewPrimes : this.moreToAddEachTime
            };
            this.morePrimesWorker.postMessage(data)
            this.morePrimesWorker.onmessage = function(e) {
                let newPrimes = e.data.newPrimes;
                for (let i = 0; i < newPrimes.length; i++) {
                    self.primes.push(newPrimes[i]);
                }
                self.currentMaxInteger = e.data.newIndex;
                self.updateDownload();
                self.working = false;
            }
        },
        updateDownload () {
            let filename = "primes.txt";
            let text = PrepareFileHelper.process(this.primes);
            let downloadButton = this.$refs.download;
            downloadButton.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            downloadButton.setAttribute('download', filename);
        }
    }
}
</script>
<style lang="scss">
.prime-numbers {
    .prime-list {
        height: 300px;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(83, 83, 83);
        overflow : scroll;
    }
    .busy {
        height: 80px;
        text-align: center;

    }
    .prime-item:nth-child(odd) {
        background-color: rgb(240, 240, 240);
    }
    .btn-group {
        margin-top: 1em;
    }
}
</style>