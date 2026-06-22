import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "TI-ICT Docs",
  favicon: "img/favicon.png",

  future: {
    v4: true
  },

  url: "https://lordimmaculate.github.io",
  baseUrl: process.env.GITHUB_PAGES ? "/proxmox-frontend-next/" : "/",

  organizationName: "lordimmaculate",
  projectName: "proxmox-frontend-next",

  trailingSlash: false,

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "nl",
    locales: ["nl"],
    localeConfigs: {
      nl: { label: "Nederlands" }
    }
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/lordimmaculate/proxmox-frontend-next/tree/main/"
        },
        theme: {
          customCss: "./src/css/custom.css"
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: "TI-ICT Docs",
      logo: {
        alt: "Don Bosco SDW Logo",
        src: "img/favicon.png"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "serverSidebar",
          position: "left",
          label: "Server"
        },
        {
          type: "docSidebar",
          sidebarId: "tiIctVmsSidebar",
          position: "left",
          label: "TI-ICT VMs"
        },
        {
          href: "https://github.com/lordimmaculate/proxmox-frontend-next",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Server",
              to: "/docs/server/overview"
            },
            {
              label: "TI-ICT VMs",
              to: "/docs/web/overview"
            }
          ]
        },
        {
          title: "Meer",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/lordimmaculate/proxmox-frontend-next"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TI-ICT.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
