# ChessML - Design Blueprints

**What is this document?** This document should cover all **high level** questions you may have about my project without
requiring you to dig through my code for answers. I write about the "why" for each decision, maybe cover a bit of
alternatives I considered, and give a general
overview of this decision in practice using examples.

**What inspired you to make this app?** I love chess. I also enjoy implementing new paradigms and learning as I go. This
may explain why some of my design decisions seem overkill. Not all decisions were made solely based on developer time
efficiency. 

## 1. Pub/Sub service architecture

#### But why?

* A pub/sub model is excellent for all three of:
    * standardizing a communication protocol between various clients (language agnostic, Human and/or AI driven) hosted
      from various environments (i.e. locally vs. cloud).
    * enforcing a standardize rule set which all clients must abide, cutting out malicious or buggy behaviors.
    * synchronizing game updates to all interested parties.

#### Implementation details

1. All `Messages` are standardized to communicate board positions (states) and moves (actions) inspired by popular
   formats
   (i.e. FEN/PGN) that conveniently compress to plain ASCII text.
1. All `Topics` are generally divided between:
    * A request for action, listed possible legal moves and current board state.
    * An action in response to the above request.
    * Game lifecycle information - including initiation and termination.
1. `Publishers` are the clients in the case of initiation games and responding with moves during the match. The
   arbitrator service assigned to a specific game will act as the publisher for all game update data,
   including requesting clients to respond with an action. **Publishers will remain static for a given topic.**
1. `Subscribers` are typically clients "watching" the actions transform the board state. These are typically, but not
   limited to, the clients playing the game. The arbitrator will also act as a subscriber once a client is prompted to
   respond to the current board state with a valid action. **Subscribers will remain static for a given topic.**

The messages will be transported via websockets over `TCP`. This route was chosen over HTTP polling in order to minimize
user frustrations with transactional lag induced between polling segments. There can be time-sensitive situations where
fractions of a second determine a winner.

#### Healthy alternatives

I absolutely could have utilized the tried and true `HTTP` request combined with a REST backend + postgresql DB to store
live game state. But stateless apps require re-contextualization on every interaction, whether that's context stored on
a DB or context that is trusted to be un-tampered by a client. Regardless, re-initializing game state is slower than
making incremental changes to long-lived instances on memory. 

If we're going to talk about speed, I should also mention that a peer-to-peer communication system would have also been 
a clear winner in terms of speed. The issues with peer-to-peer in this case would be 1. its difficult to do validation 
with only two validators, each with their own conflicting agendas. And 2. Coming from a phase in decentralized blockchain 
technology, I'm burnt out with this line of thinking.

## 2. 