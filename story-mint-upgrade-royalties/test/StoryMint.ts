import { expect } from "chai";
import { ethers } from "hardhat";

describe("StoryMint", function () {
  it("mints with tokenURI and sets default royalty", async function () {
    const [a, b] = await ethers.getSigners();

    const Splitter = await ethers.getContractFactory("RoyaltySplitter");
    const splitter = await Splitter.connect(a).deploy([await a.getAddress(), await b.getAddress()], [70,30]);
    await splitter.waitForDeployment();

    const Story = await ethers.getContractFactory("StoryMint");
    const story = await Story.connect(a).deploy();
    await story.waitForDeployment();

    await (await story.setDefaultRoyalty(await splitter.getAddress(), 500)).wait(); // 5%

    const mintTx = await story.connect(a).mint("data:application/json,{\"name\":\"Test\"}");
    const receipt = await mintTx.wait();
    const tokenId = (await story["balanceOf"](await a.getAddress())).toString();
    expect(tokenId).to.equal("1");

    // ERC2981 royaltyInfo view
    const info = await story.royaltyInfo(1, 10000n);
    expect(info[1]).to.equal(500n); // 5% of 10000
  });
});
