import { DockAPI } from '../../src/api';

require('dotenv').config();

const { FullNodeEndpoint } = process.env;

void async function() {
  let blockHash = '0xbccba08075ef66c6dd6fd5d3847d7c5206afecb1d6873d4ef5ca3f9aaf187fd2'; // earlier block, less numbers
  let blockHash1 = '0x32c5323ac923d2275b44df2556f3828a37137def1eedb18c15f4665b0b93d81a'; // later block, more numbers
  let address = '5CUrmmBsA7oPP2uJ58yPTjZn7dUpFzD1MtRuwLdoPQyBnyWM';
  
  const dock = new DockAPI();
  	await dock.init({
    	address: FullNodeEndpoint,
  	});
    
  const {
    data: { free },
  } = await dock.api.query.system.account.at(blockHash, address);
  console.log('free', free.toNumber())

  const {
    data: { free1 },
  } = await dock.api.query.system.account.at(blockHash1, address);
  console.log('free1', free.toNumber())

  // const { block } = await dock.api.rpc.chain.getBlock(blockHash);
  // console.log(block.extrinsics[1].method.args);

  const events = await dock.api.query.system.events.at(blockHash);
  console.log(events[2].toJSON());
}();