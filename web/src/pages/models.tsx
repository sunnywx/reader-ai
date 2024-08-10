import { useEffect, useState } from "react";

export async function getServerSideProps(ctx) {
  const resp=await fetch(`http://localhost:3001/llms`)
  const data=await resp.json()

  return {
    props: {
      models: data?.llms || []
    }
  }
}

interface Props {
  models: Array<{id: string, name: string}>
}

export default function Models({models=[]}: Props) {
  // const [models, setModels] = useState([]);

  // useEffect(() => {
  //   const fetchModels = async () => {
  //     const resp = await fetch("/api/models");
  //     // const resp = await fetch("http://localhost:3001/llms");
  //     const data = await resp.json();

  //     setModels(data.llms || []);
  //   };

  //   fetchModels();
  // }, []);

  return (
    <div>
      <h2>AI models</h2>

      {models.map((v) => (
        <div key={v.id}>{v.name}</div>
      ))}
    </div>
  );
}
