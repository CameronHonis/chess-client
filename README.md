# ChessML - Design Blueprints

**What is this document?** This document should cover all **high level** questions you may have about my project without
requiring you to dig through my code for answers. I write about the "why" for each decision, maybe cover a bit of
alternatives I considered, and give a general
overview of this decision in practice using examples.

**What inspired you to make this app?** I love chess. I also enjoy implementing new paradigms and learning as I go. This
may explain why some of my design decisions seem overkill. Not all decisions were made solely based on developer time
efficiency.

## 1. Pub/Sub over Websockets

#### But why?

* A pub/sub model is excellent for all three of:
    * standardizing a communication protocol between various clients (language agnostic, Human and/or AI driven) hosted
      from various environments (i.e. locally vs. cloud).
    * enforcing a standardize rule set which all clients must abide, cutting out malicious or buggy behaviors.
    * synchronizing game updates to all interested parties.

#### Implementation details

1. The main requirement for low latency, high throughput communication would 
   (i.e. FEN/PGN) that conveniently compress to plain ASCII text.
1. All `Topics` are generally divided between:
    * A request for action, listed possible legal moves and current board state.
    * An action in response to the above request.
    * Game lifecycle information - including initiation and termination.

The messages will be transported via websockets over `TCP`. This route was chosen over HTTP polling in order to minimize
user frustrations with transactional lag induced between polling segments. There can be time-sensitive situations where
fractions of a second determine a winner.

#### Healthy alternatives

I absolutely could have utilized the tried and true `HTTP` request combined with a REST backend + postgresql DB to store
live game state. But stateless apps require re-contextualization on every interaction, whether that's context stored on
a DB or context that is trusted to be un-tampered by a client. Regardless, re-initializing game state is slower than
making incremental changes to long-lived instances on memory. 

If we're going to talk about speed, I should also mention that a peer-to-peer communication system would have also been 
a clear winner in terms of speed. To be transparent, I just wasn't interested in putting in the extra effort to make the
peer-to-peer model work. 

## 2. Microservice architecture

A microservice architecture has a high barrier to entry compared to more tightly coupled integrations. I wanted to experience
with this sort of setup though, since the bulk of my experience is in architectures with larger services. A key result is that
the microservice architecture allowed for much more specific, concise, and useful integration tests. But the flip side of this
coin is that most features became spread thin over many services, which significantly slowed development speed down.

## 3. Event Dispatches

Although I used a pub/sub model in the communication between the client and the arbitrator (server), I decided to go with an
event-driven approach on the services in the backend. This appoach materialized after I removed all dependency circles in the
service network. With a new, acyclic tree of services, I needed a way to pass messages back "up" the tree. I eventually landed
on an approach similar to how the web handles events in the DOM, event bubbling. 

This approach was very useful in situations where one event needed to be bubbled through an amount of services greater than 1.
In a pub/sub approach, if more than one service was interested in the state of another service, I would've required that all the
services listen to that topic at some point before the message occurred. With event bubbling, I just needed to describe the
dependency graph of all services one time during setup, and events would just naturally bubble. Services could choose to ignore
these events or handle them, depending on the type of event or the data that is contained in it.
