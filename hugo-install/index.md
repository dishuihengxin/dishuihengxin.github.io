# Windows 10 安装 hugo 的文档


Hugo 是一个用 Go 语言编写的快速而现代的静态网站生成器，简单易用，高效易扩展，轻量易部署，旨在使网站创建再次变得有趣。Hugo 仅需要一个二进制文件 hugo (或 hugo.exe )即可轻松用于本地调试和生成静态页面，Hugo 生成静态页面的效率是非常高的。

Hugo 自带 watch 的调试模式，会自动检测文件的更新而自动刷新页面，可以边写边浏览效果，不仅能提高写作的效率还能提高博文的质量。再加上 Hugo 是使用 Go 语言编写，各方面都很 nice，所以用 Hugo 来写静态网站是一件极其享受的事儿。

静态页面不需要像动态页面那样经常去查询数据库，而是直接将最终页面内容返回，使得访问速度体验非常流畅。同时便于搜索引擎索引，静态的页面对各大搜索引擎是十分友好的。抛弃数据库，减少复杂度，将最复杂的一步交给静态网站生成器，让我们可以更专注于写作。

使用 hugo 构建的网站，可以托管在任何的地方，可以放在自搭的服务器上，也可以放在 Github pages，S3，Azure，CloudFront 等等，不需要依赖于任何的数据库和其他编程语言。通常我们会选择托管在 Github Pages 上，可以自定义一个个性的域名，这就非常 nice 了！

安装 hugo 很简单，可以从 hugo 官方[Github](https://github.com/gohugoio/hugo/releases "")下载对应系统的最新的二进制文件( hugo 或 hugo.exe )，目前最新的版本是0.48，然后添加到电脑环境变量即可。

![](https://res.cloudinary.com/kalid/image/upload/blog/img/hugo-version.png)

我们通过命令行来先学习一下hugo的基本指令：

```bash
	
D:\Hugo\bin>hugo help
	
hugo is the main command, used to build your Hugo site.

Hugo is a Fast and Flexible Static Site Generator built with love by spf13 and friends in Go.

Complete documentation is available at http://gohugo.io/.

Usage:	
  	hugo [flags]
  	hugo [command]

Available Commands:
	benchmark   Benchmark Hugo by building a site a number of times.
  	config      Print the site configuration
 	convert     Convert your content to different formats
  	env         Print Hugo version and environment info
  	gen         A collection of several useful generators.
  	help        Help about any command
  	import      Import your site from others.
 	list        Listing out various types of content
  	new         Create new content for your site
  	server      A high performance webserver
  	version     Print the version number of Hugo
Flags:
  	-b, --baseURL string      hostname (and path) to the root, e.g. http://spf13.com/
  	-D, --buildDrafts         include content marked as draft
  	-E, --buildExpired        include expired content
  	-F, --buildFuture         include content with publishdate in the future
    --cacheDir string         filesystem path to cache directory. Defaults: $TMPDIR/hugo_cache/
    --canonifyURLs            (deprecated) if true, all relative URLs will be canonicalized using baseURL
    --cleanDestinationDir     remove files from destination not found in static directories
    --config string           config file (default is path/config.yaml|json|toml)
	-c, --contentDir string   filesystem path to content directory
    --debug                   debug output
    -d, --destination string  filesystem path to write files to
    --disableKinds strings    disable different kind of pages (home, RSS etc.)
    --enableGitInfo           add Git revision, date and author info to the pages
    --forceSyncStatic         copy all files when static is changed.
    --gc                      enable to run some cleanup tasks (remove unused cache files) after the build
    -h, --help                help for hugo
    --i18n-warnings           print missing translations
    --ignoreCache             ignores the cache directory
    -l, --layoutDir string    filesystem path to layout directory
    --log                     enable Logging
    --logFile string          log File path (if set, logging enabled automatically)
    --minify                  minify any supported output format (HTML, XML etc.)
    --noChmod                 don't sync permission mode of files
    --noTimes                 don't sync modification time of files
    --pluralizeListTitles     (deprecated) pluralize titles in lists using inflect (default true)
    --preserveTaxonomyNames   (deprecated) preserve taxonomy names as written ("Gérard Depardieu" vs "gerard-depardieu")
    --quiet                   build in quiet mode
    --renderToMemory          render to memory (only useful for benchmark testing)
    -s, --source string       filesystem path to read files relative from
    --stepAnalysis            display memory and timing of different steps of the program
    --templateMetrics         display metrics about template executions
    --templateMetricsHints    calculate some improvement hints when combined with --templateMetrics
    -t, --theme string        theme to use (located in /themes/THEMENAME/)
    --themesDir string        filesystem path to themes directory
    --uglyURLs                (deprecated) if true, use /filename.html instead of /filename/
    -v, --verbose             verbose output
    --verboseLog              verbose logging
    -w, --watch               watch filesystem for changes and recreate as needed
Additional help topics:
	hugo check                Contains some verification checks
Use `hugo [command] --help` for more information about a command.
```
好了，hugo 已经安装好了，下一篇将介绍一下基于 github pages 的快速创建一个个人博客。


