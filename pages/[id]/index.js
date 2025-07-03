import { Client } from "@notionhq/client";
import Link from "next/link";
import Block from "../../components/Block";
import Nav from "../../components/Nav";
import styles from "../../styles/Home.module.scss";
import { useRouter } from "next/navigation";

import DoodleStarsBackground from "../../components/StarsBackground";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Post({ blocks, title }) {
  const router = useRouter();

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.back}>
          <div onClick={() => router.back()}>← Volver</div>
        </div>
        <div className={styles.articleContainer}>
          <h1>{title}</h1>
          {blocks.map((block, key) => {
            return <Block data={block} key={key} />;
          })}
          <DoodleStarsBackground />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const entries = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "niceUrl",
      rich_text: {
        equals: params.id,
      },
    },
  });

  if (
    entries.results.length == 0 ||
    entries.results[0].properties.visible.checkbox == false
  ) {
    return {
      notFound: true,
    };
  }

  const blocks = await notion.blocks.children.list({
    block_id: entries.results[0].id,
  });

  const mappedBlocks = blocks.results.map(async (block) => {
    let filteredBlock = { ...block };

    if (block.has_children) {
      const blockId = block.id;
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 50,
      });

      const filteredChildren = response.results.map((item) => {
        filterUnwantedOptions(item);
        return item;
      });
      filteredBlock[block.type].children = filteredChildren;
    }

    function filterUnwantedOptions(obj) {
      delete obj.object;
      delete obj.id;
      delete obj.parent;
      delete obj.created_time;
      delete obj.last_edited_time;
      delete obj.created_by;
      delete obj.last_edited_by;
      // delete filteredBlock.has_children;
      delete obj.archived;
    }

    filterUnwantedOptions(filteredBlock);

    return filteredBlock;
  });

  const blocksResolved = await Promise.all(mappedBlocks);

  return {
    props: {
      blocks: blocksResolved,
      title: entries.results[0].properties.name.title[0].plain_text,
    },
  };
}
