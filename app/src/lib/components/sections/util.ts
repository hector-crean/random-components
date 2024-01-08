
export enum Ordering {
    GT = 1,
    LT = -1,
    EQ = 0
  }
  
  export interface Ord<A> {
    compare(x: A, y: A): Ordering;
  }
  
  export const ascending: Ord<number> = {
    compare: (x: number, y: number): Ordering =>
      x < y ? Ordering.LT : x > y ? Ordering.GT : Ordering.EQ
  }
  
  export const descending: Ord<number> = {
    compare: (x: number, y: number): Ordering =>
      x < y ? Ordering.GT : x > y ? Ordering.LT : Ordering.EQ
  }
  
  
  export const sort = <A>(O: Ord<A>, as: A[]) => as.sort(O.compare);
  
  
  export const invert = <A>(ord: Ord<A>): Ord<A> => ({
    compare: (x: A, y: A) => ord.compare(y, x)
  });
    
 

  export const contramap = <A, B>(f: (b: B) => A, O: Ord<A>): Ord<B> => ({
    compare: (x: B, y: B) => O.compare(f(x), f(y))
  });
  

  const appendOrdering = (x: Ordering, y: Ordering) => 
  x === Ordering.EQ ? y : x;


  export const append = <A>(x: Ord<A>, y: Ord<A>): Ord<A> => ({
    compare: (x1: A, y1: A) =>
      appendOrdering(x.compare(x1, y1), y.compare(x1, y1))
  });





  

  type SectionActivityParams = {
    idx: number,
    isInView: boolean;
    deltaTop: number,
    deltaBotton: number
  }

  const stringOrd: Ord<string> = ({
    compare: (x: string, y: string) => x < y ? Ordering.LT : x > y ? Ordering.GT : Ordering.EQ
  })
  
  const numOrd: Ord<number> = ({
    compare: (x: number, y: number) => x < y ? Ordering.LT : x > y ? Ordering.GT : Ordering.EQ
  })

  const booleanOrd: Ord<boolean> = ({
    compare: (x: boolean, y: boolean) => x < y ? Ordering.LT : x > y ? Ordering.GT : Ordering.EQ
  })


  //extending stringOrd to work on Person objects
  const isInvViewOrd: Ord<SectionActivityParams> = contramap(x => x.isInView, booleanOrd);
  const deltaOffsetTopOrd: Ord<SectionActivityParams> = contramap(x => x.deltaTop, numOrd);
  const deltaOffsetBottomOrd: Ord<SectionActivityParams> = contramap(x => x.deltaBotton, numOrd);

  
  //combining Ord<Person> instances
  const sectionActivityOrdForScrollDown: Ord<SectionActivityParams> = append(invert(isInvViewOrd), deltaOffsetTopOrd);
  const sectionActivityOrdForScrollUp: Ord<SectionActivityParams> = append(invert(isInvViewOrd), deltaOffsetBottomOrd);


  export { sectionActivityOrdForScrollDown, sectionActivityOrdForScrollUp };
export type { SectionActivityParams };

