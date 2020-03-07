import './scss/global.scss';

const logoTxt = '真〜久W';

Vue.component('logo', {
    props: {
        'id':Number,
        'src':String,
        'caption':String,
        'alt':String,
        'href':String
    },
    template: '<figure :style="makeBackground" class="logo"><img :alt="alt" style="display:none;" :src="src"><figcaption><a :href="href">{{caption}}</a></figcaption></figure>',
    computed: {
        makeBackground: function() {
            if(this.src)
                return 'background-image:url('+this.src+')';
        }
    }
});

Vue.component('cards', {
    props: {
        'id':String,
        'heading':String,
        'subheading':String,
        'deck':Array,
        'filters':Array
    },
    template: '<article data-component="cards" :id="id">' + 
                '<header>' +
                    '<h3>{{heading}}</h3>' + 
                    '<p>{{subheading}}</p>' + 
                    '<form data-filterer>' + 
                        '<label>' +
                            '<input type="checkbox" id="event" value="event" checked @change="sort">Event' + 
                        '</label>' +
                        '<label>' +
                            '<input type="checkbox" id="artist" value="artist" checked @change="sort">Artist' + 
                        '</label>' +      
                    '</form>' + 
                '</header>' + 
                '<dl v-if="deck" data-filterable>' + 
                    '<slot v-for="card in deck">' + 
                        '<transition name="slide-fade">' + 
                        "<dt :id=\"'dt__' + card.id\" :data-filter=\"card.filter\" v-if=\"checkFilters(card.filter)\">" + 
                            '<a v-if="card.href" :href="card.href" :target="card.target">' +
                                '{{card.title}}' + 
                            '</a>' + 
                            '<slot v-else>{{card.title}}</slot>' + 
                        '</dt>' + 
                        '</transition>' + 
                        '<transition name="slide-fade">' + 
                        "<dd :id=\"'dd__' + card.id\" :data-filter=\"card.filter\" v-if=\"checkFilters(card.filter)\">" + 
                            '<p>{{card.description}}</p>' + 
                        '</dd>' + 
                        '</transition>' + 
                    '</slot>' + 
                '</dl>' + 
              '</article>',
    methods: {
        checkFilters: function(keys) {
            let show_it = false;

            for(var k = 0; k <= keys.length; k++){
                if( show_it != true ) {
                    if( this.filters.includes(keys[k]) ) {
                        show_it = true;
                        return true;
                    }
                }
            };

            if( show_it != true ) {
                return false;
            }
        }, 
        sort: function(event) {
            if(event) {
                let needle =  event.target.value;
                let results = this.results;
                let filters = this.filters;

                if( filters ) {
                    if( filters.includes(needle) ) {
                        for(var f = filters.length-1; f >= 0; f--){
                            if(filters[f] === needle) {
                                filters.splice(f,1);
                            }
                        }
                    }else{
                        filters.push(needle);
                    }
                }
            }
        }
    }
});

Vue.component('accordion', {
    props: {
        'id':String,
        'summary':String,
        'details':String
    },
    template: '<details v-on:click="enableOnly" data-component="accordion">' + 
                '<summary :id="id">{{summary}}</summary>' +
                '<p>{{details}}</p>' + 
              '</details>'
    ,
    methods: {
        enableOnly: function() {
            let details = this.$el;
            if( !details.open ) {
                let kids = details.parentElement.children;
                
                Object.values(kids).forEach(kid => {
                    kid.removeAttribute('open');
                });
            }
        }
    }
});

Vue.component('callout', {
    props: {
        'id':String,
        'title':String,
        'content':String,
        'bSrc':String,
        'label':String,
        'href':String,
        'target':String
    },
    template: '<article data-component="callout" :id="id" class="container" :style="makeBackground">' + 
                '<img :src="bSrc" v-if="bSrc" style="display:none;">' + 
                '<h2>{{title}}</h2>' +
                '<p>{{content}}</p>' +
                '<nav v-if="href">' +
                    '<a class="button secondary" :href="href" :target="target">{{label}}</a>' +
                '</nav>' + 
             '</article>',
    methods: {
        makeBackground: function() {
            if(this.bSrc) {
                this.$emit('cSrc', this.bSrc);
                return 'background-image:url('+this.bSrc+')';
            }
        }
    }
});

Vue.component('location', {
    props: {
        'id':String,
        'url':String
    },
    template: '<iframe data-component="location" :id="id" width="100%" height="480" id="gmap_canvas" :src="url" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>'
});

Vue.component('slideshow', {
    props: {
        'id':String,
        'heading':String,
        'subheading':String,
        'slides':Array
    },
    template: '<article :id="id" data-component="slideshow">' +
                '<slide v-for="slide in slides" v-bind:key="slide.id" :id="slide.id" :title="slide.title" :caption="slide.caption" :f-src="slide.fSrc" :m-src="slide.mSrc" :b-src="slide.bSrc" :label="slide.label" :target="slide.target" :href="slide.href"></slide>' +
              '</article>',
    methods: {
        init: function() {
            //console.log('slides!');
        }
    },
    beforeMount() {
        this.init();
    }
});

Vue.component('slide', {
    props: {
        'id':String,
        'bSrc':String,
        'mSrc':String,
        'fSrc':String,
        'title':String,
        'caption':String,
        'label':String,
        'href':String,
        'target':String
    },
    template: '<figure :style="makeBackground" class="slide">' +
                '<img :src="bSrc" alt="" style="display:none;">' +
                '<figcaption>' +
                    '<p>{{caption}}</p>' + 
                    '<nav>' + 
                        '<a :href="href" :target="target" class="button secondary">{{label}}</a>' + 
                    '</nav>' +
                '</figcaption>' + 
              '</figure>',
    computed: {
        makeBackground: function() {
            if(this.bSrc)
                return 'background-image:url('+this.bSrc+')';
        }
    }
});

var header = new Vue({
    el: 'body > header',
    data: {
        style : 'dark',
        caption: logoTxt,
        href: '#top',
        menu : {
            id: 'primary-menu',
            links: [
                {   href: '#about_us',
                    label: 'the Facility',
                    active: false
                },
                {   href: '#our_location',
                    label: 'the Location',
                    active: false
                },
                {   href: '#our_pricing',
                    label: 'the Pricing',
                    active: false
                }
            ]
        }
    },
    methods: {
        setActive: function(event) {
            let menu = document.getElementById(this.menu.id);
            let anchors = menu.querySelectorAll('li > a');
            
            anchors.forEach(anchor => {
                if( anchor === event.target ) {
                    event.target.classList.add('active');
                }else{
                    anchor.classList.remove('active');
                }
            });
        }
    }
  });

var main = new Vue({
    el: 'main',
    data: {
        style: 'dark', 
        cSrc: false,
        sections : [
        {
            id: 'about_us',
            style: 'primary slideshow',
            components: [
                {
                    slideshow: [
                        {
                            id: 'our_slideshow',
                            title: 'A question about the imagery shown',
                            subheading: 'Explore the answer to the question breifly, teasing the imagery in the slideshow',
                            slides: [
                                {
                                    id: 'slide0',
                                    bSrc: 'https://via.placeholder.com/2560x1280',
                                    title: 'Lorem Ipsum',
                                    caption: 'Lorem ipsum sin dolor set anum quin sinod',
                                    label: 'Find out more',
                                    href:  '#someplace',
                                    target: '_self'
                                },
                                {
                                    id: 'slide1',
                                    bSrc: 'https://via.placeholder.com/2560x1280',
                                    title: 'Lorem Ipsum quin',
                                    caption: 'Lorem ipsum sin dolor set anum quin sinod',
                                    label: 'Find out more',
                                    href:  '#someplace',
                                    target: '_self'
                                },
                                {
                                    id: 'slide2',
                                    bSrc: 'https://via.placeholder.com/2560x1280',
                                    title: 'Lorem Ipsum ultim',
                                    caption: 'Lorem ipsum sin dolor set anum quin sinod',
                                    label: 'Find out more',
                                    href:  '#someplace',
                                    target: '_self'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'our_location',
            style: 'location',
            slides: false,
            header: [
                {
                    title: 'Find Us on a Map',
                    style: 'dark', 
                    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                }
            ],
            components: [
                {
                    location: [
                        {
                            id: 'our_map',
                            url: 'https://maps.google.com/maps?q=5805%20Lincoln%20st&t=&z=13&ie=UTF8&iwloc=&output=embed'
                        }
                    ]
                }
            ]
        },
        {
            id: 'our_pricing',
            style: 'dark shadowed pricing',
            slides: false,
            header: [
                {
                    title: 'Affordable Pricing',
                    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                }
            ],
            components: [
                {
                    style: 'container', 
                    cards: [
                        {
                            id: 'cards--pricing',
                            heading: 'Pricing Cards',
                            subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                            filters: ['event', 'artist'],
                            results: 'Show all results', 
                            deck: [
                                {
                                    id: 'event--single',
                                    filter: ['event','single'],
                                    title: 'An Event',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                },
                                {
                                    id: 'event--monthly', 
                                    filter: ['event','month'],
                                    title: 'A Month of Events',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                },
                                {
                                    id: 'event--annually',
                                    filter: ['event','annual'],
                                    title: 'A Year of Events',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                },
                                {
                                    id: 'artist--hourly',
                                    filter: ['artist','single'],
                                    title: '1 Hour',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                },
                                {
                                    id: 'artist--monthly',
                                    filter: ['artist','month'],
                                    title: '1 Month',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                },
                                {
                                    id: 'artist--annually',
                                    filter: ['artist','annual'],
                                    title: '1 Year',
                                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'accordion_component',
            style: 'shadowed faqs',
            slides: false,
            header: [
                {
                    title: 'Create an accordion component',
                    content: 'Create an encapsulated expander component to show and hide content. Each instance of the expander should be able to determine state and control the other instances to ensure only one accordion is open at a time.'
                }
            ],
            components: [
                {
                    accordions: [
                        {
                            id: 'lipsum_question_1',
                            summary: 'Lipsum Question 1',
                            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        },
                        {
                            id: 'lipsum_question_2',
                            summary: 'Lipsum Question 2',
                            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        },
                        {
                            id: 'lipsum_question_3',
                            summary: 'Lipsum Question 3',
                            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'join_us',
            style: 'royal callout',
            slides: false,
            components: [
                {
                    callout: [
                        {
                            id: 'join_us',
                            title: 'Join Us',
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                            bSrc: 'https://via.placeholder.com/1600x600', 
                            label: 'Learn More',
                            href: '#join_us',
                            target: '_self'
                        }
                    ]
                }
            ]
        }
        ]
    }, 
    computed: {
        makeBackground: function() {
            console.log('go!', this.cSrc);
            //if(this.cSrc) {
                
                //return 'background-image:url('+this.bSrc+')';
            //}
        }
    }
})

var footer = new Vue({
    el: 'body > footer',
    data: {
        style : 'dark',
        caption: logoTxt,
        href: '#top',
        menu : {
            id: 'secondary-menu',
            links: [
                {   href: '#privacy',
                    label: 'Privacy Policy'
                },
                {   href: '#terms',
                    label: 'Terms & Conditions'
                }
            ]
        }
    }
})