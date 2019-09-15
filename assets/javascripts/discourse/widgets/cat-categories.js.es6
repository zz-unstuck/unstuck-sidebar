import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { number } from 'discourse/lib/formatter';

createWidget('cat-category', {
  tagName: 'div.cat-link',

  html(c) {
    if (c.parent_category_id) {
      this.tagName += '.subcategory';
    }

    this.tagName += '.category-' + Discourse.Category.slugFor(c, '-');

    const results = [
      this.attach("category-link", { category: c, allowUncategorized: true })
    ];


     const unreadTotal =
      parseInt(c.get("unreadTopics"), 10) + parseInt(c.get("newTopics"), 10);
    if (unreadTotal) {
      results.push(
        h(
          "a.badge.badge-notification",
          {
            attributes: { href: c.get("url") }
          },
          number(unreadTotal)
        )
      );
    }

    if (!this.currentUser) {
      let count;

      if (c.get("show_subcategory_list")) {
        count = c.get("totalTopicCount");
      } else {
        count = c.get("topic_count");
      }

      results.push(h("b.topics-count", number(count)));
    }

    return results;
}

});

export default createWidget('cat-categories', {
  tagName: 'div.category-links.clearfix',

  html(attrs) {
    let title = I18n.t("filters.categories.title");
    if (attrs.moreCount > 0) {
     title += I18n.t("categories.more", { count: attrs.moreCount });
    }

    let result = [  ];


    result = result.concat(
        h(
          "div.zag",
          h(
            "div.oglavl", title)
        )
     );

    const categories = attrs.categories;
    if (categories.length === 0) {
      return;
    }
    result = result.concat(
      categories.map(c => this.attach("cat-category", c))
    );

    return result;
  }
});
