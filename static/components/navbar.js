export default ({
    template: /*html*/`
        <div class="content-wrapper d-flex justify-content-between align-items-center p-3">
            <h1 class="logo-font button-like" @click="goHome" style="curser: pointer;">LA MAISON</h1>
            <div class="text-center d-flex align-items-center">
                <span class="navbar-text m-0 logo-font">pure élégance.</span>
            </div>
            <div class="text-right">
                <img :src="logoUrl" class="logo img-fluid" alt="Logo">
            </div>
        </div>

        <hr class="logo-hr">
        <br><br>
    `,

    data() {
        return {
            logoUrl: 'static/img/logo-no-text.png'
        }
    },

    methods: {
        goHome() {
            window.location.href = '/'
        }
    }
});
