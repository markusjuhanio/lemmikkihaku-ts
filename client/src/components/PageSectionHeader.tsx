import React from 'react';

interface PageSectionHeaderProps {
  title: string
}

const PageSectionHeader = (props: PageSectionHeaderProps) => {
  const { title } = props;
  return (
    <h2>{title}</h2>
  );
};

export default PageSectionHeader;