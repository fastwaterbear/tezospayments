class InlineChunkHtmlPlugin {
  static inlinedTagInfos = new Map()
    .set('script', {
      sourceTagName: 'script',
      targetTagName: 'script',
      predicate: _tag => true,
      getAssetName: tag => tag && tag.attributes && tag.attributes.src,
    })
    .set('link', {
      sourceTagName: 'link',
      targetTagName: 'style',
      predicate: tag => tag && tag.attributes && tag.attributes.rel === 'stylesheet',
      getAssetName: tag => tag && tag.attributes && tag.attributes.href,
    });

  constructor(htmlWebpackPlugin) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
      const deletedAssets = new Set();
      const tagFunction = tag => {
        const inlinedTag = this.getInlinedTag(compilation.assets, tag);
        if (inlinedTag !== tag && inlinedTag.assetName)
          deletedAssets.add(inlinedTag.assetName);

        return inlinedTag;
      };
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);

      hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);
      });

      hooks.afterEmit.tap('InlineChunkHtmlPlugin', () => {
        for (const assetName of deletedAssets)
          delete compilation.assets[assetName];
      });
    });
  }

  getInlinedTag(assets, tag) {
    const tagInfo = InlineChunkHtmlPlugin.inlinedTagInfos.get(tag.tagName);
    if (!tagInfo || !tagInfo.predicate(tag))
      return tag;

    const assetName = tagInfo.getAssetName(tag);
    if (!assetName)
      return tag;

    const asset = assets[assetName];
    return asset
      ? { tagName: tagInfo.targetTagName, innerHTML: asset.source(), closeTag: true, assetName }
      : tag;
  }
}

module.exports = InlineChunkHtmlPlugin;
