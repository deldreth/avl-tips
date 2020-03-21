import React from "react";
import { Link } from "react-router-dom";

import Config from "../../Config";

function Footer() {
  return (
    <footer className="support-footer has-text-white">
      <a
        href={Config.image.attr.url}
        className="has-text-white"
        data-cy="link-image-attribution"
      >
        Image: {Config.image.attr.name}
      </a>{" "}
      |{" "}
      <Link to="/dev" className="has-text-white" data-cy="link-developers">
        Developers and Third Parties
      </Link>{" "}
      |{" "}
      <a
        href={`mailto:${Config.mailto}`}
        className="has-text-white"
        data-cy="link-contact"
      >
        Questions and Data Privacy Inquiries
      </a>
    </footer>
  );
}

export default Footer;
