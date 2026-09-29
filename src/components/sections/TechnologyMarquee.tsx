import { memo } from "react";
import {
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiHuggingface,
  SiOpenai,
  SiLangchain,
  SiPandas,
  SiNumpy,
  SiFastapi,
  SiStreamlit,
  SiPlotly,
  SiPostgresql,
  SiDocker,
  SiJupyter,
  SiOpencv,
  SiKeras,
  SiSnowflake,
  SiDatabricks,
  SiApachehadoop,
  SiApachekafka,
  SiN8N,
  SiClaude,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import Marquee from "../common/Marquee";
import LogoLoop from "../common/LogoLoop";

const ROW_A = [
  "MACHINE LEARNING",
  "DEEP LEARNING",
  "NLP",
  "GENERATIVE AI",
  "COMPUTER VISION",
  "DATA ANALYTICS",
];

// Brand-colored tech logos — each icon carries its own original color.
// Multicolor brand marks (Google Cloud, VS Code) and Cursor are self-hosted
// SVGs under /public/logos so they render in their true colors.
const techLogos = [
  { node: <SiPython color="#3776AB" />, title: "Python", href: "https://www.python.org" },
  { node: <SiTensorflow color="#FF6F00" />, title: "TensorFlow", href: "https://www.tensorflow.org" },
  { node: <SiPytorch color="#EE4C2C" />, title: "PyTorch", href: "https://pytorch.org" },
  { node: <SiKeras color="#D00000" />, title: "Keras", href: "https://keras.io" },
  { node: <SiScikitlearn color="#F7931E" />, title: "scikit-learn", href: "https://scikit-learn.org" },
  { node: <SiHuggingface color="#FFD21E" />, title: "Hugging Face", href: "https://huggingface.co" },
  { node: <SiOpenai color="#FFFFFF" />, title: "ChatGPT", href: "https://chatgpt.com" },
  { node: <SiClaude color="#D97757" />, title: "Claude", href: "https://claude.ai" },
  { node: <SiLangchain color="#1C988E" />, title: "LangChain", href: "https://www.langchain.com" },
  { node: <SiPandas color="#E70488" />, title: "pandas", href: "https://pandas.pydata.org" },
  { node: <SiNumpy color="#4DABCF" />, title: "NumPy", href: "https://numpy.org" },
  { node: <SiOpencv color="#5C3EE8" />, title: "OpenCV", href: "https://opencv.org" },
  { node: <SiFastapi color="#009688" />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <SiStreamlit color="#FF4B4B" />, title: "Streamlit", href: "https://streamlit.io" },
  { node: <SiPlotly color="#7A76FF" />, title: "Plotly", href: "https://plotly.com" },
  { node: <SiJupyter color="#F37626" />, title: "Jupyter", href: "https://jupyter.org" },
  { node: <SiN8N color="#EA4B71" />, title: "n8n", href: "https://n8n.io" },
  { node: <SiPostgresql color="#4169E1" />, title: "PostgreSQL", href: "https://www.postgresql.org" },
  { node: <SiSnowflake color="#29B5E8" />, title: "Snowflake", href: "https://www.snowflake.com" },
  { node: <SiDatabricks color="#FF3621" />, title: "Databricks", href: "https://www.databricks.com" },
  { node: <SiApachehadoop color="#66CCFF" />, title: "Apache Hadoop", href: "https://hadoop.apache.org" },
  { node: <SiApachekafka color="#FFFFFF" />, title: "Apache Kafka", href: "https://kafka.apache.org" },
  { node: <SiDocker color="#2496ED" />, title: "Docker", href: "https://www.docker.com" },
  { node: <FaAws color="#FF9900" />, title: "AWS", href: "https://aws.amazon.com" },
  { node: <VscAzure color="#0089D6" />, title: "Microsoft Azure", href: "https://azure.microsoft.com" },
  { src: "/logos/googlecloud.svg", alt: "Google Cloud", title: "Google Cloud", href: "https://cloud.google.com" },
  { src: "/logos/vscode.svg", alt: "Visual Studio Code", title: "VS Code", href: "https://code.visualstudio.com" },
  { src: "/logos/cursor.svg", alt: "Cursor", title: "Cursor", href: "https://cursor.com" },
];

const TechnologyMarquee = () => {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--panel)] py-8 md:py-10">
      <Marquee
        items={ROW_A}
        baseVelocity={-2.5}
        className="font-display text-4xl md:text-7xl font-black tracking-tight text-[var(--text)]"
      />

      {/* Colorful brand-logo loop */}
      <div className="relative mt-8 h-[72px] md:mt-10 md:h-[88px]">
        <LogoLoop
          logos={techLogos}
          speed={70}
          direction="left"
          logoHeight={44}
          gap={64}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#0a0a0a"
          ariaLabel="Technologies and tools I work with"
        />
      </div>
    </section>
  );
};

export default memo(TechnologyMarquee);
