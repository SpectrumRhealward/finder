import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import s from "./Block.module.scss";
import TxsComponent from "../../pages/Txs";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime } from "../../scripts/utility";

const Block = (
  props: RouteComponentProps<{ height: string; network: string }>
) => {
  const { match } = props;
  const { height } = match.params;

  const Height = (header: BlockHeader) => (
    <span className={s.height}>
      <span>{header.height}</span>
      <Link to={`${parseInt(height) - 1}`}>
        <i className="material-icons">chevron_left</i>
      </Link>
      <Link to={`${parseInt(height) + 1}`}>
        <i className="material-icons">chevron_right</i>
      </Link>
    </span>
  );

  const Txs = (txCount: number) => (
    <span>
      {txCount > 0 ? (
        <>{txCount} Transactions</>
      ) : (
        <span className={s.none}>0 Transactions</span>
      )}
    </span>
  );

  const parentHash = (header: BlockHeader) => (
    <Link className={s.button} to={`${parseInt(height) - 1}`}>
      {header.last_block_id.hash}
    </Link>
  );

  return (
    <>
      <WithFetch url={`/blocks/${height}`} loading={<Loading />}>
        {(blockData: Block) => (
          <>
            <h2 className="title">
              Block<span>#{height}</span>
            </h2>
            <div className={s.list}>
              <div className={s.row}>
                <div className={s.head}>Block height</div>
                <div className={s.body}>{Height(blockData.block.header)}</div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Timestamp</div>
                <div className={s.body}>
                  {fromISOTime(blockData.block.header.time)}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Transactions</div>
                <div className={s.body}>
                  {Txs(blockData.block.data.txs?.length)}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Proposer</div>
                <div className={s.body}>
                  {blockData.block.header.proposer_address}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Block hash</div>
                {blockData.block_id && (
                  <div className={s.body}>{blockData.block_id.hash}</div>
                )}
                {blockData.block_meta && (
                  <div className={s.body}>
                    {blockData.block_meta.block_id.hash}
                  </div>
                )}
              </div>
              <div className={s.row}>
                <div className={s.head}>Parent hash</div>
                <div className={s.body}>
                  {parentHash(blockData.block.header)}
                </div>
              </div>
            </div>
          </>
        )}
      </WithFetch>
      <TxsComponent height={height} />
    </>
  );
};

export default Block;
