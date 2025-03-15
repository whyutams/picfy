const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const axios = require('axios').default;
const cheerio = require('cheerio');
require('dotenv').config();

app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for testing
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.all('/', async (req, res) => {
    let postData = null;
    let is_error = false;
    let data = {};

    if (req.method == 'POST') {
        postData = req.body; 

        let nim = postData?.nim?.slice(0, 12);
        (async () => {
            try {
                let response = await axios.get(`https://mahasiswa.ung.ac.id/${nim}/about`)
                const $ = cheerio.load(response.data);

                let pp = $("#content").find("#about").find(".img").find("img").attr("src").trim();
                data.pp = pp;
                let nama = $("#content").find("#about").find(".col-md-9").find(".form-group").eq(1).find("p").text().trim();
                data.nama = nama;

                if(data.pp==null) {
                    is_error = true;
                    data = {};
                }

                res.render('index', {
                    data: postData ? data : postData,
                    is_error: is_error
                });
            } catch (error) {
                console.log("Gagal fetch data", error);
                is_error = true;
                data={};
                postData=null;

                res.render('index', {
                    data: postData ? data : postData,
                    is_error: is_error
                });
            }
        })();
    } else {
        res.render('index', {
            data: postData ? data : postData,
            is_error: is_error
        });
    }

});

/* 404 handler */
app.use((req, res, next) => {
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
