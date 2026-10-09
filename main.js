/* DENIS SURYA — Portfolio | main.js */


/* =========================================================
   1) สร้าง <img> จาก data-img
   ถ้าไม่มีไฟล์ จะไม่แสดงรูป
========================================================= */

document.querySelectorAll('.ph[data-img]').forEach(function (box) {

  var src = box.dataset.img;

  box.dataset.file = src;

  var img = new Image();

  img.alt = box.dataset.alt || src.split('/').pop();

  img.loading = 'lazy';

  img.onerror = function () {
    img.remove();
  };

  img.src = src;

  box.appendChild(img);

});


/* =========================================================
   IMAGE LIGHTBOX
   กดรูปเพื่อดูรูปเต็ม
========================================================= */

(function () {

  var boxes = document.querySelectorAll(
    '.tiles .tile.ph[data-img]'
  );

  if (!boxes.length) return;


  /* ---------------------------------------------------------
     สร้าง Lightbox
  --------------------------------------------------------- */

  var lightbox = document.createElement('div');

  lightbox.className = 'image-lightbox';

  lightbox.innerHTML = `
    <button
      type="button"
      class="image-lightbox-close"
      aria-label="ปิดรูป"
    >×</button>

    <div class="image-lightbox-inner">
      <img
        class="image-lightbox-img"
        alt=""
      >
    </div>
  `;

  document.body.appendChild(lightbox);


  var lightboxImg =
    lightbox.querySelector('.image-lightbox-img');

  var closeButton =
    lightbox.querySelector('.image-lightbox-close');


  /* ---------------------------------------------------------
     เปิดรูป
  --------------------------------------------------------- */

  function openLightbox(box) {

    var img = box.querySelector('img');

    if (!img) return;


    lightboxImg.src =
      img.currentSrc ||
      img.src ||
      box.dataset.img;


    lightboxImg.alt =
      img.alt ||
      box.dataset.alt ||
      'Portfolio Image';


    lightbox.classList.add('open');

    document.body.classList.add('lightbox-open');

  }


  /* ---------------------------------------------------------
     ปิดรูป
  --------------------------------------------------------- */

  function closeLightbox() {

    lightbox.classList.remove('open');

    document.body.classList.remove('lightbox-open');

    lightboxImg.removeAttribute('src');

  }


  /* ---------------------------------------------------------
     คลิกรูป
  --------------------------------------------------------- */

  boxes.forEach(function (box) {

    box.addEventListener(
      'click',
      function (event) {

        if (
          event.target.closest('a') ||
          event.target.closest('button')
        ) {
          return;
        }

        openLightbox(box);

      }
    );

  });


  /* ---------------------------------------------------------
     ปุ่มปิด
  --------------------------------------------------------- */

  closeButton.addEventListener(
    'click',
    function () {

      closeLightbox();

    }
  );


  /* ---------------------------------------------------------
     คลิกพื้นที่ด้านนอกเพื่อปิด
  --------------------------------------------------------- */

  lightbox.addEventListener(
    'click',
    function (event) {

      if (event.target === lightbox) {

        closeLightbox();

      }

    }
  );


  /* ---------------------------------------------------------
     กด ESC เพื่อปิด
  --------------------------------------------------------- */

  document.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Escape' &&
        lightbox.classList.contains('open')
      ) {

        closeLightbox();

      }

    }
  );

})();


/* =========================================================
   REDUCED MOTION
========================================================= */

var reduce = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================================
   2) ตัวเลขสถิติวิ่งขึ้นตอนเลื่อนมาถึง
========================================================= */

var counters = document.querySelectorAll('[data-count]');

if (counters.length) {

  var io = new IntersectionObserver(function (entries) {

    entries.forEach(function (e) {

      if (!e.isIntersecting) return;

      var el = e.target;

      var end = +el.dataset.count;

      var t0 = performance.now();

      var dur = 1400;

      io.unobserve(el);


      if (reduce) {

        el.textContent = end + '+';

        return;

      }


      (function tick(now) {

        var p = Math.min(
          (now - t0) / dur,
          1
        );


        el.textContent =
          Math.round(
            end * (1 - Math.pow(1 - p, 3))
          ) + '+';


        if (p < 1) {

          requestAnimationFrame(tick);

        }

      })(t0);

    });

  }, {
    threshold: .6
  });


  counters.forEach(function (c) {

    io.observe(c);

  });

}


/* =========================================================
   3) สไลด์รูปในการ์ด My Project
========================================================= */

document.querySelectorAll('.stack').forEach(function (stack) {

  var items = stack.querySelectorAll('.ph');

  var i = 0;


  if (!items.length) return;


  items[0].classList.add('on');


  if (reduce || items.length < 2) return;


  setInterval(function () {

    items[i].classList.remove('on');

    i = (i + 1) % items.length;

    items[i].classList.add('on');

  }, 2800);

});


/* =========================================================
   4) PORTFOLIO TABS
   Graphic Design / Visual Art / Video Editor
========================================================= */

(function () {

  var tabs = document.querySelectorAll(
    '#pf-tabs button[data-cat]'
  );


  var panels = {

    graphic: document.getElementById('panel-graphic'),

    visual: document.getElementById('panel-visual'),

    video: document.getElementById('panel-video')

  };


  var title = document.getElementById('pf-title');


  /* ถ้าไม่มีหน้า Portfolio ก็ไม่ต้องทำงาน */

  if (!tabs.length || !title) return;


  /* ชื่อหัวข้อของแต่ละหมวด */

  var titles = {

    graphic: 'Graphic Design',

    visual: 'Visual Art',

    video: 'Video Editor'

  };


  /* ---------------------------------------------------------
     ฟังก์ชันเปลี่ยน Portfolio
  --------------------------------------------------------- */

  function showPortfolio(category, updateHash) {


    /*
      ถ้าค่าไม่ตรงกับหมวดที่มี
      ให้กลับไป Graphic Design
    */

    if (!panels[category]) {

      category = 'graphic';

    }


    /* -------------------------
       แสดง / ซ่อน Panel
    ------------------------- */

    Object.keys(panels).forEach(function (key) {

      var panel = panels[key];


      if (!panel) return;


      if (key === category) {

        panel.hidden = false;

      } else {

        panel.hidden = true;

      }

    });


    /* -------------------------
       เปลี่ยนสถานะปุ่ม
    ------------------------- */

    tabs.forEach(function (tab) {

      var active =
        tab.dataset.cat === category;


      tab.setAttribute(
        'aria-selected',
        active ? 'true' : 'false'
      );


      tab.classList.toggle(
        'active',
        active
      );

    });


    /* -------------------------
       เปลี่ยนหัวข้อใหญ่
    ------------------------- */

    title.textContent = titles[category];


    /* -------------------------
       เปลี่ยน URL Hash
    ------------------------- */

    if (updateHash !== false) {

      var newHash = '#' + category;


      if (window.location.hash !== newHash) {

        history.replaceState(
          null,
          '',
          newHash
        );

      }

    }

  }


  /* ---------------------------------------------------------
     คลิกปุ่มแต่ละหมวด
  --------------------------------------------------------- */

  tabs.forEach(function (tab) {

    tab.addEventListener('click', function () {

      var category =
        tab.dataset.cat;


      showPortfolio(
        category,
        true
      );

    });

  });


  /* ---------------------------------------------------------
     อ่าน Hash ตอนเปิดหน้า

     portfolio.html
     portfolio.html#graphic
     portfolio.html#visual
     portfolio.html#video
  --------------------------------------------------------- */

  function getHashCategory() {

    var hash =
      window.location.hash
        .replace('#', '')
        .toLowerCase()
        .trim();


    if (hash === 'visual') {

      return 'visual';

    }


    if (
      hash === 'video' ||
      hash === 'video-editor'
    ) {

      return 'video';

    }


    if (hash === 'graphic') {

      return 'graphic';

    }


    return 'graphic';

  }


  /* ---------------------------------------------------------
     เปิดหมวดแรก
  --------------------------------------------------------- */

  showPortfolio(
    getHashCategory(),
    false
  );


  /* ---------------------------------------------------------
     รองรับการเปลี่ยน Hash
  --------------------------------------------------------- */

  window.addEventListener(
    'hashchange',
    function () {

      showPortfolio(
        getHashCategory(),
        false
      );

    }
  );

})();


/* =========================================================
   5) ปีใน Footer
========================================================= */

var y = document.getElementById('year');

if (y) {

  y.textContent =
    new Date().getFullYear();

}


/* =========================================================
   EFFECTS v2
========================================================= */

(function () {

  var canHover =
    window.matchMedia(
      '(hover: hover)'
    ).matches;


  var wait = function (ms) {

    return new Promise(function (r) {

      setTimeout(r, ms);

    });

  };


  /* =======================================================
     พิมพ์ข้อความ
  ======================================================= */

  function prep(el) {

    var txt = el.textContent;


    var on =
      document.createElement('span');


    var off =
      document.createElement('span');


    off.textContent = txt;

    off.style.visibility = 'hidden';


    el.textContent = '';

    el.append(on, off);


    return {

      el: el,

      on: on,

      off: off,

      txt: txt

    };

  }


  function type(o, speed, hold) {

    return new Promise(function (res) {

      var i = 0;


      o.el.classList.add('typing');


      (function step() {

        if (i < o.txt.length) {

          o.on.textContent +=
            o.txt[i];


          o.off.textContent =
            o.txt.slice(i + 1);


          i++;


          setTimeout(
            step,
            speed +
            Math.random() *
            speed *
            .6
          );


        } else {

          setTimeout(function () {

            o.el.classList.remove(
              'typing'
            );

          }, hold || 0);


          res();

        }

      })();

    });

  }


  /* =======================================================
     HERO TYPING
  ======================================================= */

  var port =
    document.querySelector('.port');


  var folio =
    document.querySelector('.folio');


  var meta =
    document.querySelector('.hero-meta');


  var role =
    document.getElementById('role');


  if (port && folio) {

    if (reduce) {

      folio.classList.add(
        'show',
        'done'
      );


      if (meta) {

        meta.classList.add('show');

      }


    } else {

      var pP =
        prep(port);


      var pF =
        prep(
          folio.querySelector('.t')
        );


      var pR =
        role
          ? prep(role)
          : null;


      wait(500)

        .then(function () {

          return type(
            pP,
            150,
            0
          );

        })


        .then(function () {

          folio.classList.add(
            'show'
          );


          setTimeout(function () {

            folio.classList.add(
              'done'
            );

          }, 700);


          return wait(380);

        })


        .then(function () {

          return type(
            pF,
            130,
            2200
          );

        })


        .then(function () {

          if (meta) {

            meta.classList.add(
              'show'
            );

          }


          return wait(500);

        })


        .then(function () {

          if (pR) {

            return type(
              pR,
              30,
              2600
            );

          }

        });

    }

  }


  /* =======================================================
     ถ้าเปิด Reduced Motion
  ======================================================= */

  if (reduce) return;


  /* =======================================================
     แถบความคืบหน้าการเลื่อน
  ======================================================= */

  var bar =
    document.createElement('div');


  bar.className =
    'progress';


  document.body.appendChild(bar);


  function prog() {

    var h =
      document.documentElement;


    var m =
      h.scrollHeight -
      h.clientHeight;


    bar.style.transform =
      'scaleX(' +
      (
        m > 0
          ? h.scrollTop / m
          : 0
      ) +
      ')';

  }


  addEventListener(
    'scroll',
    prog,
    {
      passive: true
    }
  );


  prog();


  /* =======================================================
     อนุภาคแสงใน Hero
  ======================================================= */

  var hero =
    document.querySelector('.hero');


  if (hero) {

    var cv =
      document.createElement(
        'canvas'
      );


    hero.insertBefore(
      cv,
      hero.firstChild
    );


    var ctx =
      cv.getContext('2d');


    var W = 0;

    var H = 0;


    var dpr =
      Math.min(
        devicePixelRatio || 1,
        2
      );


    var ps = [];


    var vis = true;


    var size = function () {

      W =
        hero.clientWidth;


      H =
        hero.clientHeight;


      cv.width =
        W * dpr;


      cv.height =
        H * dpr;


      cv.style.width =
        W + 'px';


      cv.style.height =
        H + 'px';


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

    };


    size();


    addEventListener(
      'resize',
      size
    );


    for (
      var k = 0;
      k < 70;
      k++
    ) {

      ps.push({

        x:
          Math.random() * W,

        y:
          Math.random() * H,

        r:
          .6 +
          Math.random() * 1.8,

        v:
          .08 +
          Math.random() * .25,

        p:
          Math.random() * 6.28,

        s:
          .5 +
          Math.random() * 1.5

      });

    }


    new IntersectionObserver(
      function (e) {

        vis =
          e[0].isIntersecting;

      }
    ).observe(hero);


    (function frame(t) {

      if (vis) {

        ctx.clearRect(
          0,
          0,
          W,
          H
        );


        ps.forEach(function (p) {

          p.y -= p.v;


          if (p.y < -10) {

            p.y =
              H + 10;


            p.x =
              Math.random() * W;

          }


          ctx.beginPath();


          ctx.fillStyle =
            'rgba(150,180,255,' +
            (
              .25 +
              .55 *
              Math.abs(
                Math.sin(
                  t / 1000 *
                  p.s +
                  p.p
                )
              )
            ) +
            ')';


          ctx.shadowColor =
            '#4a73ff';


          ctx.shadowBlur =
            12;


          ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            6.283
          );


          ctx.fill();

        });

      }


      requestAnimationFrame(
        frame
      );

    })(0);


    var ring =
      hero.querySelector(
        '.ring'
      );


    if (ring && canHover) {

      hero.addEventListener(
        'pointermove',
        function (e) {

          var r =
            hero.getBoundingClientRect();


          ring.style.translate =
            (
              -(
                e.clientX -
                r.left
              ) /
              r.width *
              40 +
              20
            ) +
            'px ' +
            (
              -(
                e.clientY -
                r.top
              ) /
              r.height *
              28 +
              14
            ) +
            'px';

        }
      );

    }

  }


  /* =======================================================
     Reveal ตอนเลื่อน
  ======================================================= */

  var rvSel =
    '.card,.edu,.faq details,.stats>div,.tile,.photo,.phone,.stack,.about>div:last-child,.skills h3,.icons,.bars';


  document
    .querySelectorAll('.bars li')
    .forEach(function (li, i) {

      li.style.setProperty(
        '--d',
        (
          .25 +
          i * .09
        ) + 's'
      );

    });


  var rvIO =
    new IntersectionObserver(
      function (es) {

        es.forEach(function (e) {

          if (
            e.isIntersecting
          ) {

            e.target.classList.add(
              'in'
            );


            rvIO.unobserve(
              e.target
            );

          }

        });

      },
      {
        threshold: .12,

        rootMargin:
          '0px 0px -6% 0px'
      }
    );


  document
    .querySelectorAll(rvSel)
    .forEach(function (el) {

      var idx =
        Array.prototype.indexOf.call(
          el.parentNode.children,
          el
        );


      el.style.setProperty(
        '--d',
        Math.min(
          idx,
          8
        ) * .07 + 's'
      );


      el.classList.add(
        'rv'
      );


      rvIO.observe(el);

    });


  /* =======================================================
     Hover Effects
  ======================================================= */

  if (!canHover) return;


  /* =======================================================
     แสงเคอร์เซอร์ทั่วหน้า
  ======================================================= */

  var glow =
    document.createElement(
      'div'
    );


  glow.className =
    'cursor-glow';


  document.body.appendChild(
    glow
  );


  addEventListener(
    'pointermove',
    function (e) {

      glow.style.transform =
        'translate(' +
        e.clientX +
        'px,' +
        e.clientY +
        'px)';


      glow.classList.add(
        'on'
      );

    },
    {
      passive: true
    }
  );


  /* =======================================================
     Spotlight ตามเมาส์
  ======================================================= */

  var sel =
    '.ph,.card,.edu,.proj,.faq details';


  document.addEventListener(
    'pointermove',
    function (e) {

      if (!e.target.closest) return;


      for (
        var n =
          e.target.closest(sel);

        n;

        n =
          n.parentElement &&
          n.parentElement.closest(sel)
      ) {

        var r =
          n.getBoundingClientRect();


        n.style.setProperty(
          '--mx',
          (
            e.clientX -
            r.left
          ) + 'px'
        );


        n.style.setProperty(
          '--my',
          (
            e.clientY -
            r.top
          ) + 'px'
        );

      }

    },
    {
      passive: true
    }
  );


  /* =======================================================
     เอียง 3D ตามเมาส์
  ======================================================= */

  document
    .querySelectorAll(
      '.photo,.tile,.phone,.stack,.card,.edu'
    )
    .forEach(function (el) {

      el.setAttribute(
        'data-tilt',
        ''
      );


      var k =
        el.classList.contains(
          'tile'
        )
          ? 10
          : 6;


      el.addEventListener(
        'pointermove',
        function (e) {

          var r =
            el.getBoundingClientRect();


          var x =
            (
              e.clientX -
              r.left
            ) /
            r.width -
            .5;


          var y =
            (
              e.clientY -
              r.top
            ) /
            r.height -
            .5;


          el.style.transform =
            'perspective(900px) ' +
            'rotateX(' +
            (
              -y * k
            ).toFixed(2) +
            'deg) ' +
            'rotateY(' +
            (
              x * k
            ).toFixed(2) +
            'deg)';

        }
      );


      el.addEventListener(
        'pointerleave',
        function () {

          el.style.transform =
            '';

        }
      );

    });

})();


/* =========================================================
   พื้นหลังแสงเลื่อนตามการ Scroll
   Parallax
========================================================= */

(function () {

  if (
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    return;

  }


  var root =
    document.documentElement;


  var tick = false;


  addEventListener(
    'scroll',
    function () {

      if (tick) return;


      tick = true;


      requestAnimationFrame(
        function () {

          root.style.setProperty(
            '--sy',
            window.scrollY
          );


          tick = false;

        }
      );

    },
    {
      passive: true
    }
  );

})();


/* =========================================================
   ไอคอน Skills Software
   ทำเป็นแถบเลื่อนวน
========================================================= */

(function () {

  var box =
    document.querySelector(
      '.icons'
    );


  if (!box) return;


  var track =
    document.createElement(
      'div'
    );


  track.className =
    'track';


  while (
    box.firstChild
  ) {

    track.appendChild(
      box.firstChild
    );

  }


  var originals =
    Array.prototype.slice.call(
      track.children
    );


  var sets =
    Math.max(
      1,
      Math.ceil(
        window.innerWidth /
        (
          originals.length *
          74
        )
      )
    );


  for (
    var s = 0;
    s < sets * 2 - 1;
    s++
  ) {

    originals.forEach(
      function (n) {

        var c =
          n.cloneNode(true);


        c.setAttribute(
          'aria-hidden',
          'true'
        );


        var im =
          c.querySelector(
            'img'
          );


        if (im) {

          if (
            !n.querySelector('img')
          ) {

            im.remove();

          } else {

            im.onerror =
              function () {

                this.remove();

              };

          }

        }


        track.appendChild(c);

      }
    );

  }


  box.appendChild(track);


  box.classList.add(
    'marquee'
  );

})();

/* =========================================================
   IMAGE LIGHTBOX
   คลิกรูปเพื่อดูภาพขนาดใหญ่
========================================================= */

(function () {

  var boxes = document.querySelectorAll(
    '.tiles .tile.ph[data-img]'
  );

  if (!boxes.length) return;

  /* สร้าง Lightbox ให้ตรงกับ CSS เดิม */
  var lightbox = document.getElementById('imageLightbox');

  if (!lightbox) {

    lightbox = document.createElement('div');

    lightbox.id = 'imageLightbox';

    lightbox.innerHTML = `
      <button
        type="button"
        class="image-lightbox-close"
        aria-label="ปิดรูป"
      >×</button>

      <img
        class="image-lightbox-image"
        alt=""
      >
    `;

    document.body.appendChild(lightbox);

  }

  var lightboxImg = lightbox.querySelector(
    '.image-lightbox-image'
  );

  var closeButton = lightbox.querySelector(
    '.image-lightbox-close'
  );

  if (!lightboxImg || !closeButton) return;

  /* เปิดรูป */
  function openLightbox(box) {

    var img = box.querySelector('img');

    var src = box.dataset.img;

    if (img && img.src) {
      src = img.currentSrc || img.src;
    }

    if (!src) return;

    lightboxImg.src = src;

    lightboxImg.alt =
      box.dataset.alt ||
      (img && img.alt) ||
      'Portfolio Image';

    lightbox.classList.add('show');

    document.body.classList.add('lightbox-open');

    closeButton.focus();

  }

  /* ปิดรูป */
  function closeLightbox() {

    lightbox.classList.remove('show');

    document.body.classList.remove('lightbox-open');

    lightboxImg.removeAttribute('src');

  }

  /* คลิกรูปเพื่อเปิด */
  boxes.forEach(function (box) {

    box.setAttribute('tabindex', '0');

    box.setAttribute('role', 'button');

    box.addEventListener('click', function (event) {

      if (
        event.target.closest('a') ||
        event.target.closest('button')
      ) {
        return;
      }

      openLightbox(box);

    });

    /* รองรับ Enter และ Space */
    box.addEventListener('keydown', function (event) {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();

        openLightbox(box);
      }

    });

  });

  /* ปุ่มปิด */
  closeButton.addEventListener('click', closeLightbox);

  /* คลิกพื้นหลังเพื่อปิด */
  lightbox.addEventListener('click', function (event) {

    if (event.target === lightbox) {
      closeLightbox();
    }

  });

  /* กด Escape เพื่อปิด */
  document.addEventListener('keydown', function (event) {

    if (
      event.key === 'Escape' &&
      lightbox.classList.contains('show')
    ) {
      closeLightbox();
    }

  });

})();
var img = box.querySelector('img');
var src = box.dataset.img;

if (img && img.currentSrc) {
  src = img.currentSrc;
}

lightboxImg.src = src;
lightbox.classList.add('show');
document.body.classList.add('lightbox-open');