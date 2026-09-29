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
  SiNextdotjs,
  SiTypescript,
  SiReact,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import Marquee from "../common/Marquee";
import LogoLoop, { type LogoItem } from "../common/LogoLoop";

const ROW_A = [
  "MACHINE LEARNING",
  "DEEP LEARNING",
  "NLP",
  "GENERATIVE AI",
  "COMPUTER VISION",
  "DATA ANALYTICS",
];

// Brand-colored tech logos with foundation models and modern framework marks
const techLogos: LogoItem[] = [
  { node: <SiPython color="#3776AB" />, title: "Python", href: "https://www.python.org" },
  { node: <SiTensorflow color="#FF6F00" />, title: "TensorFlow", href: "https://www.tensorflow.org" },
  { node: <SiPytorch color="#EE4C2C" />, title: "PyTorch", href: "https://pytorch.org" },
  { src: "/logos/gemini.svg", alt: "Google Gemini", title: "Google Gemini", href: "https://gemini.google.com" },
  { src: "/logos/nvidia.svg", alt: "NVIDIA", title: "NVIDIA", href: "https://www.nvidia.com" },
  { node: <SiOpenai color="#FFFFFF" />, title: "ChatGPT / OpenAI", href: "https://chatgpt.com" },
  { node: <SiClaude color="#D97757" />, title: "Claude / Anthropic", href: "https://claude.ai" },
  { src: "/logos/meta.svg", alt: "Meta Llama", title: "Meta Llama", href: "https://llama.meta.com" },
  { src: "/logos/mistral.svg", alt: "Mistral AI", title: "Mistral AI", href: "https://mistral.ai" },
  { node: <SiHuggingface color="#FFD21E" />, title: "Hugging Face", href: "https://huggingface.co" },
  { node: <SiLangchain color="#1C988E" />, title: "LangChain", href: "https://www.langchain.com" },
  { src: "/logos/pinecone.svg", alt: "Pinecone", title: "Pinecone Vector DB", href: "https://www.pinecone.io" },
  { node: <SiScikitlearn color="#F7931E" />, title: "scikit-learn", href: "https://scikit-learn.org" },
  { node: <SiKeras color="#D00000" />, title: "Keras", href: "https://keras.io" },
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
  { src: "/logos/googlecloud.svg", alt: "Google Cloud", title: "Google Cloud", href: "https://cloud.google.com" },
  { node: <VscAzure color="#0089D6" />, title: "Microsoft Azure", href: "https://azure.microsoft.com" },
  { node: <SiNextdotjs color="#FFFFFF" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript color="#3178C6" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiReact color="#61DAFB" />, title: "React", href: "https://react.dev" },
  { src: "/logos/vscode.svg", alt: "Visual Studio Code", title: "VS Code", href: "https://code.visualstudio.com" },
  { src: "/logos/cursor.svg", alt: "Cursor", title: "Cursor", href: "https://cursor.com" },
];

// Institutional and Enterprise Experience Crests
const institutionLogos: LogoItem[] = [
  {
    node: (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/90 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#00FF94] hover:shadow-[0_0_18px_rgba(0,255,148,0.22)]">
        <img
          src="/logos/luc-mark.svg"
          alt="Learners University College"
          className="h-6 w-auto object-contain"
        />
        <div className="flex flex-col text-left">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--text)]">LUC DUBAI</span>
          <span className="text-[9px] font-mono text-[var(--accent)]">AI Intern · 2026—Present</span>
        </div>
      </div>
    ),
    title: "Learners University College (LUC), Dubai — AI Intern",
    href: "https://learnerseducation.com",
  },
  {
    node: (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/90 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#00FF94] hover:shadow-[0_0_18px_rgba(0,255,148,0.22)]">
        <img
          src="/logos/spjain.svg"
          alt="SP Jain School of Global Management"
          className="h-6 w-auto max-w-[90px] object-contain"
        />
        <div className="flex flex-col text-left">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--text)]">SP JAIN GLOBAL</span>
          <span className="text-[9px] font-mono text-[var(--accent)]">Master of AI in Business</span>
        </div>
      </div>
    ),
    title: "SP Jain School of Global Management — Master of AI in Business & Class Representative",
    href: "https://www.spjain.org",
  },
  {
    node: (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/90 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#00FF94] hover:shadow-[0_0_18px_rgba(0,255,148,0.22)]">
        <img
          src="/logos/manipal.svg"
          alt="Manipal University Jaipur"
          className="h-6 w-auto max-w-[110px] object-contain"
        />
        <div className="flex flex-col text-left">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--text)]">MANIPAL JAIPUR</span>
          <span className="text-[9px] font-mono text-[var(--accent)]">B.Tech CSE (AI & ML)</span>
        </div>
      </div>
    ),
    title: "Manipal University Jaipur — B.Tech CSE (AI & ML) · Student Excellence Award",
    href: "https://jaipur.manipal.edu",
  },
  {
    node: (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/90 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#00FF94] hover:shadow-[0_0_18px_rgba(0,255,148,0.22)]">
        <img
          src="/logos/intelliza.svg"
          alt="Intelliza Solutions"
          className="h-6 w-auto max-w-[100px] object-contain"
        />
        <div className="flex flex-col text-left">
          <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--text)]">INTELLIZA</span>
          <span className="text-[9px] font-mono text-[var(--accent)]">ML Intern · Loan AI</span>
        </div>
      </div>
    ),
    title: "Intelliza Solutions Pvt. Ltd. — Machine Learning Intern",
    href: "https://www.intelliza.solutions",
  },
];

const TechnologyMarquee = () => {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--panel)] py-8 md:py-12">
      <Marquee
        items={ROW_A}
        baseVelocity={-2.5}
        className="font-display text-4xl font-black tracking-tight text-[var(--text)] md:text-7xl"
      />

      {/* Institutional Pedigree & Corporate Badges Loop */}
      <div className="mt-8 border-y border-[var(--border)]/50 bg-[var(--panel-2)]/30 py-4">
        <div className="mb-2 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
            // Institutional Pedigree & Engineering Practice
          </span>
        </div>
        <div className="relative h-[56px]">
          <LogoLoop
            logos={institutionLogos}
            speed={45}
            direction="right"
            logoHeight={42}
            gap={36}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--panel)"
            ariaLabel="Institutions and enterprise companies Krishna Mathur is affiliated with"
          />
        </div>
      </div>

      {/* Colorful brand-logo loop */}
      <div className="relative mt-8 h-[72px] md:mt-10 md:h-[88px]">
        <LogoLoop
          logos={techLogos}
          speed={65}
          direction="left"
          logoHeight={44}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="var(--panel)"
          ariaLabel="Technologies, foundation models and AI frameworks I work with"
        />
      </div>
    </section>
  );
};

export default memo(TechnologyMarquee);
