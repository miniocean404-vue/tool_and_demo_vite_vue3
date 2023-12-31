import { defineConfig } from "vite"
import type { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import ElementPlus from "unplugin-element-plus/vite"
import Icons from "unplugin-icons/vite"

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        // 将vue模块排除在打包文件之外，使用用这个组件库的项目的vue模块
        external: ["vue", "element-plus", "@element-plus/icons-vue", "@iconify-json/ep", /\.scss/],

        // 输出配置
        output: [
          {
            // 打包成 es module
            format: "es",
            // 重命名
            entryFileNames: "[name].js",
            // 打包目录和开发目录对应
            preserveModules: true,
            // 输出目录
            dir: "dist/es",
            // 指定保留模块结构的根目录
            preserveModulesRoot: "src",
            // 关闭默认导出和普通导出的警告信息
            exports: "named",
          },
          {
            // 打包成 commonjs
            format: "cjs",
            // 重命名
            entryFileNames: "[name].js",
            // 打包目录和开发目录对应
            preserveModules: true,
            // 输出目录
            dir: "dist/lib",
            // 指定保留模块结构的根目录
            preserveModulesRoot: "src",
            exports: "named",
          },
        ],
      },
      lib: {
        // 指定入口文件
        entry: "src/index.ts",
        // 模块名
        name: "GIE_COMPONENTS",
        // fileName: (format, entryName) => `${entryName}.${format}.js`, // 打包后的文件名
      },
    },
    plugins: [
      vue(),
      ElementPlus({
        // 导入scss而不是css
        useSource: true,
      }),
      Icons({
        autoInstall: true,
        compiler: "vue3",
        defaultStyle: "font-size: 16px;",
        scale: 1,
        defaultClass: "",
      }),
      dts({
        // 输出目录
        outDir: ["types"],
        // 将动态引入转换为静态（例如：`import('vue').DefineComponent` 转换为 `import { DefineComponent } from 'vue'`）
        staticImport: true,
        // 将所有的类型合并到一个文件中
        rollupTypes: true,
        // entryRoot: "dist",
      }),
    ],
  } as UserConfig
})
