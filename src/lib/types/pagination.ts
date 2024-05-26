type Meta = {
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  remaining_count: number;
};

type PaginationResponse<T> = {
  meta: Meta;
  items: T[];
};
