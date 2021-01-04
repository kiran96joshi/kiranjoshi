const path = require(`path`)

let siteConfig
let ghostConfig
let mediaConfig
let routesConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    mediaConfig = require(`./mediaConfig`)
} catch (e) {
    mediaConfig = null
}

try {
    routesConfig = require(`./routesConfig`)
} catch (e) {
    routesConfig = null
}

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        development: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        ghostConfig = null //allow default config to take over
    }
}

module.exports = {
    plugins: [
        `gatsby-plugin-preact`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                mediaConfig: mediaConfig,
                routes: routesConfig,
            },
        },
        {
            resolve: `gatsby-theme-ghost-dark-mode`,
            options: {
                // Set to true if you want your theme to default to dark mode (default: false)
                // Note that this setting has an effect only, if
                //    1. The user has not changed the dark mode
                //    2. Dark mode is not reported from OS
                defaultModeDark: true,
                // If you want the defaultModeDark setting to take precedence
                // over the mode reported from OS, set this to true (default: false)
                overrideOS: true,
            },
        },
        {
            resolve: `gatsby-theme-ghost-members`,
        },
        {
            resolve: `gatsby-transformer-rehype`,
            options: {
                filter: node => (
                    node.internal.type === `GhostPost` ||
                    node.internal.type === `GhostPage`
                ),
                plugins: [
                    {
                        resolve: `gatsby-rehype-ghost-links`,
                    },
                    {
                        resolve: `gatsby-rehype-prismjs`,
                    },
                ],
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // This plugin is currently causing issues: https://github.com/gatsbyjs/gatsby/issues/25360
        //`gatsby-plugin-offline`,
    ],
}
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-contact`,
        options: {
            siteMetadata: {
                // This will be added to your navigation menu
                navigation: [{ label: `Contact` }],
            },
 
            },
            // Customize your page content here
            pageContext: {
                title: `Contact`,
                path: `/contact/`,
                custom_excerpt: `Just drop us a line!`,
                feature_image: `https://static.gotsby.org/v1/assets/images/gatsby-ghost-contact.png`,
                // Can be disabled by providing an empty list []
                form_topics: [`Feedback`, `Question`],
                meta_title: `Contact`,
                meta_description: `A contact form page.`,
                // All content below the contact form
                html: ``,
            },
        },
    },
]