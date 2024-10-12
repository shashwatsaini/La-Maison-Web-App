export default ({
    template: `
        <br>
        <div class="row justify-content-center">
            <img :src="lineSeperatorUrl" class="img-fluid" style="width: 10%;" alt="Line Seperator">
        </div>
        <br>
    `,

    data() {
        return {
            lineSeperatorUrl: 'static/img/seperator.png'
        }
    }
})